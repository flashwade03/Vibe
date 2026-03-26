# v0.2 Game Annotation Runtime -- Implementation Plan

## 1. Scope and Goal

Transform the 4 core annotations (`@entity`, `@component`, `@scene`, `@on`) from parsed-but-ignored AST decorations into working Lua/LOVE 2D runtime code. After v0.2, a Vibe file with annotations should compile to a playable LOVE 2D game with entities, scenes, and event-driven logic.

**v0.2 built-in events (7):** `update`, `draw`, `enter`, `exit`, `key_pressed`, `key_released`, `mouse_pressed`

**v0.2에서 제외 (v0.3+):** `collide`, `trigger_enter`, `trigger_exit`, `late_update`, `key_down`, `mouse_released`, `mouse_moved` — LÖVE 네이티브 콜백이 없어 별도 인프라(물리 엔진 통합) 필요

**v0.2 built-in functions (5):** `spawn()`, `destroy()`, `find_all()`, `go_to()`, `emit()`

**v0.2 built-in components:** None (users define with `@component`)

---

## 2. Current State Assessment

### What already works
- Parser collects `Annotation[]` on `StructDecl`, `EnumDecl`, `TraitDecl` (ast.ts)
- Annotation parsing handles `@name("arg1", "arg2")` (parser.ts lines 293-315)
- `Param` type stores `typeAnnotation?: string` -- needed for target determination
- CodeGen ignores annotations entirely (codegen.ts)
- `vibe_runtime.lua` has Vec2, Color, math, collision
- 135 tests pass, 38 benchmark tasks

### Critical gap: FnDecl lacks annotations
The parser calls `this.parseFnDecl()` **without** passing the collected `annotations` array. The `FnDecl` interface in ast.ts has no `annotations` field. This means `@on("update")` before a `fn` is silently dropped.

---

## 3. Architecture: Two-Phase Code Generation

**Phase 1 -- Analysis:** Walk the AST to build metadata tables:
- Which structs are `@entity` / `@component` / `@scene`
- Which functions have `@on` and what are their event names + target types

**Phase 2 -- Emission:** Generate Lua in a specific order:
1. Entity/component/scene constructor functions
2. Entity defaults table
3. User-defined helper functions (no `@on`)
4. Event handler functions + registry
5. `_vibe_first_scene` assignment

The **runtime** (`vibe_runtime.lua`) provides the dispatch loop, entity storage, scene management, and LOVE callback wiring. The **codegen** fills in the data (handlers, defaults).

**Critical boundary:** In game mode, the **runtime owns all `love.*` callbacks** (`love.load`, `love.update`, `love.draw`, etc.). The codegen must **not** use the `LOVE_FUNCTIONS` name-rewriting set (codegen.ts lines 49-53). In plain mode (no annotations), existing behavior is preserved.

---

## 4. File Changes

### 4.1 Modified Files

| File | Changes |
|------|---------|
| `vibe-lang/src/parser/ast.ts` | Add `annotations: Annotation[]` to `FnDecl` interface |
| `vibe-lang/src/parser/parser.ts` | Pass `annotations` to `parseFnDecl()` at top-level (line 193) |
| `vibe-lang/src/codegen/codegen.ts` | Add `hasGameAnnotations` switch: game mode vs plain mode |
| `vibe-lang/src/runtime/vibe_runtime.lua` | Add ECS, scene manager, event dispatcher, LOVE callbacks |
| `vibe-lang/src/pipeline.ts` | May need changes if game mode requires different CompileResult |

### 4.2 New Files

| File | Purpose |
|------|---------|
| `vibe-lang/src/codegen/annotation-analyzer.ts` | AST analysis: extract entity/component/scene/event metadata |
| `vibe-lang/src/codegen/game-codegen.ts` | Game-specific Lua generation (bypasses LOVE_FUNCTIONS) |
| `vibe-lang/src/codegen/annotation-analyzer.test.ts` | Tests for analysis phase |
| `vibe-lang/src/codegen/game-codegen.test.ts` | Tests for game code generation |
| `vibe-lang/src/e2e/fixtures/entity_scene.vibe` | E2E fixture |
| `vibe-lang/src/e2e/fixtures/entity_scene.lua` | Expected Lua output |

---

## 5. Detailed Design

### 5.1 AST Changes (`ast.ts`)

Add `annotations: Annotation[]` to `FnDecl` interface. All existing test helpers that construct `FnDecl` nodes must add `annotations: []`.

### 5.2 Parser Changes (`parser.ts`)

- `parseFnDecl(annotations: Annotation[] = [])` -- add parameter with default
- Pass `annotations` from `parseTopLevelDecl` to `parseFnDecl` (line 193)
- Struct method calls (line 338): pass `[]` explicitly
- Trait method calls: pass `[]` explicitly
- `@on` on struct/trait methods is **out of scope** for v0.2

### 5.3 Annotation Analyzer (`annotation-analyzer.ts`)

```typescript
export interface GameMetadata {
  entities: Map<string, EntityInfo>;
  components: Set<string>;
  scenes: Map<string, SceneInfo>;
  eventHandlers: EventHandler[];  // 1 FnDecl with N @on → N EventHandler entries
  plainDecls: TopLevelDecl[];
  hasGameAnnotations: boolean;
}

export interface EventHandler {
  eventName: string;
  targetType: string | null;  // first param's typeAnnotation
  fnDecl: FnDecl;
}
```

**Target determination:** First parameter's `typeAnnotation` determines target. Entity type → per-instance. Scene type → active scene. No params → global.

**@on stacking:** One `FnDecl` with multiple `@on` annotations produces N separate `EventHandler` entries, all pointing to the same `FnDecl`. Example: `@on("key_pressed") @on("key_released") fn handler()` → 2 EventHandlers.

**Edge cases the analyzer must handle:**
- `@on` with no params → global handler
- `@on` with param that has no typeAnnotation → treat as global
- `@on` with param whose type matches no @entity/@scene → treat as global
- `@entity struct` with no `@on` handlers → valid (entity with no behavior)
- `@scene` without `@entity` → valid (scene-only game)

### 5.4 Game CodeGen (`game-codegen.ts`)

When `hasGameAnnotations` is true, generates:
1. Entity/scene constructors (with `_type` and `_id` fields)
2. Entity defaults table
3. Non-annotated helper functions (emitted WITHOUT `LOVE_FUNCTIONS` rewriting)
4. Event handler functions (named)
5. Handler registry table (`_vibe_handlers`)
6. `_vibe_first_scene` assignment (first `@scene` struct declared)

**Special call handling in game mode:**
- `spawn(Player, ...)` → emit as `spawn("Player", ...)` (identifier → string literal)
- `destroy(entity)` → emit as-is (runtime function)
- `find_all(Enemy)` → emit as `find_all("Enemy")`
- `go_to(GamePlay, ...)` → emit as `go_to("GamePlay", {...})` (args → Lua table)

**`go_to` named-arg handling:** The parser discards named-arg names in CallExpr. For v0.2, `go_to` takes positional args after the scene name. The runtime constructs the scene with positional override. Full named-arg support deferred to v0.3.

### 5.5 Runtime Additions (`vibe_runtime.lua`)

**Entity Storage:**
- `_vibe_entities` -- all live entities
- `_vibe_next_id` -- auto-increment ID
- `_vibe_destroy_queue` -- deferred destruction

**Scene Manager:**
- `_vibe_current_scene` -- active scene instance
- `_vibe_scene_defaults` -- set by codegen
- `_vibe_handlers` -- event handler registry, set by codegen

**5 Built-in Functions:**
- `spawn(type_name, overrides_table)` → create entity, add to storage, dispatch "enter"
- `destroy(entity)` → mark for deferred destruction, dispatch "exit" at frame end
- `find_all(type_name)` → filter `_vibe_entities` by `_type`
- `go_to(scene_name, params_table)` → exit current scene, destroy entities, enter new scene
- `emit(entity, signal_name, ...)` → dispatch to matching handlers

**LOVE Callbacks (owned by runtime, NOT codegen):**
```lua
love.load()         → go_to(_vibe_first_scene) if set
love.update(dt)     → _vibe_dispatch("update", dt) + _vibe_process_destroy_queue()
love.draw()         → _vibe_dispatch("draw")
love.keypressed(k)  → _vibe_dispatch_input("key_pressed", k)
love.keyreleased(k) → _vibe_dispatch_input("key_released", k)
love.mousepressed(x,y,b) → _vibe_dispatch_mouse("mouse_pressed", x, y, b)
```

**Dispatch Logic:**
- Per-entity handler: iterate `_vibe_entities`, filter by `_type`, call handler
- Per-scene handler: check `_vibe_current_scene._type`, call handler
- Global handler: call directly

### 5.6 CodeGen Integration

```typescript
export function generate(program, options) {
  const metadata = analyzeAnnotations(program);
  if (metadata.hasGameAnnotations) {
    return generateGameMode(program, metadata, options);
  }
  return generatePlainMode(program, options);  // existing behavior, unchanged
}
```

`generatePlainMode` = current `generate` logic extracted. All existing tests use this path.

### 5.7 `@on` Named Args

v0.2: Only positional string args (`@on("update")`). Named filter args (`@on("key_pressed", key: "space")`) deferred to v0.3. Key filtering done in handler body: `if key == "space"`.

---

## 6. Execution Plan (Stages)

### Stage 1: AST + Parser
- Add `annotations: Annotation[]` to `FnDecl` + update all test FnDecl constructions
- Update `parseFnDecl` signature, pass annotations from `parseTopLevelDecl`
- 3 new parser tests

### Stage 2: Annotation Analyzer
- Implement `analyzeAnnotations()` with TDD (10 tests including edge cases)

### Stage 3: Game CodeGen
- Implement `generateGameMode()` with TDD (8 tests)
- Must bypass `LOVE_FUNCTIONS` rewriting

### Stage 4: Runtime
- Add ECS, scene manager, event dispatch to `vibe_runtime.lua`
- Lua functions follow agreed API contract (see Section 5.5)

### Stage 5: Integration
- Wire analyzer + game codegen into `codegen.ts generate()`
- Update `pipeline.ts` if needed

### Stage 6: E2E Tests
- Create fixtures and tests
- Verify all 135 existing tests pass

### Stage 7: Benchmark Extension
- 4-6 new annotation benchmark tasks

---

## 7. Agent-Teams Design

### Runtime API Contract (agreed before agents start)

All agents must use these exact Lua function signatures:

```lua
-- Entity
spawn(type_name_string, overrides_table_or_nil) → entity
destroy(entity) → nil
find_all(type_name_string) → list_of_entities

-- Scene
go_to(scene_name_string, params_table_or_nil) → nil

-- Signal
emit(entity, signal_name_string, ...) → nil

-- Internal (set by codegen, used by runtime)
_vibe_handlers = { event_name = { {entity_type=str, scene_type=str, handler=fn}, ... } }
_vibe_entity_defaults = { TypeName = fn() → entity }
_vibe_scene_defaults = { SceneName = fn(params) → scene }
_vibe_first_scene = "SceneName" or nil
```

### Agent A: Parser (Stage 1)
**Owns:** `ast.ts`, `parser.ts`, `parser.test.ts`
**Also updates:** `codegen.test.ts` FnDecl constructions (add `annotations: []`)

### Agent B: Analyzer + Game CodeGen (Stages 2-3)
**Owns:** `annotation-analyzer.ts`, `game-codegen.ts` + tests
**Depends on:** Agent A (needs FnDecl.annotations), Agent C (needs API contract)

### Agent C: Runtime (Stage 4)
**Owns:** `vibe_runtime.lua`
**Depends on:** API contract (agreed upfront, see above)

### Agent D: Integration + E2E + Benchmarks (Stages 5-7)
**Owns:** `codegen.ts` (integration), `pipeline.ts`, `e2e.test.ts`, fixtures, `benchmark/tasks.ts`
**Depends on:** Agents A, B, C

### Execution Order

```
[Parallel]
  Agent A (Parser + test fixes) ────┐
  Agent C (Runtime)  ───────────────┤
                                    ▼
[Sequential]
  Agent B (Analyzer + GameCodegen) ─┐
                                    ▼
[Sequential]
  Agent D (Integration + E2E)
```

---

## 8. Risk Analysis

| Risk | Mitigation |
|------|-----------|
| Breaking existing codegen | `hasGameAnnotations` flag creates clean split |
| FnDecl change breaks tests | Agent A updates all FnDecl constructions in codegen.test.ts |
| Runtime `love.update` conflicts with codegen | Game mode: runtime owns `love.*`. Plain mode: codegen uses `LOVE_FUNCTIONS`. Mutually exclusive |
| `@on` named args unsupported | Explicitly v0.3; body-level filtering works |
| Entity target type resolution | Uses `param.typeAnnotation` string matching; no type checker needed |
| `go_to` named args not parsed | v0.2: positional args only. v0.3: full named-arg support |
| Agent B/C API mismatch | API contract agreed upfront (Section 7) |
| `LOVE_FUNCTIONS` name collision in game mode | `generateGameMode` bypasses `LOVE_FUNCTIONS` set entirely |

---

## 9. Key Invariants

1. All 135 existing tests pass
2. Non-game Vibe files compile identically (`hasGameAnnotations: false` path)
3. Generated Lua runs with `love build/` without modification
4. `:` remains type-annotation-only
5. 20 keywords unchanged

---

## 10. Testing Strategy

| Category | Count | Where |
|----------|-------|-------|
| Parser: `@on` on FnDecl | 3 new | `parser.test.ts` |
| Parser: FnDecl construction fixes | ~30 updated | `codegen.test.ts` |
| Analyzer: metadata extraction + edge cases | 10 new | `annotation-analyzer.test.ts` |
| Game CodeGen: Lua emission | 8 new | `game-codegen.test.ts` |
| E2E: full pipeline game mode | 3 new | `e2e.test.ts` |
| Existing tests | 135 unchanged | all test files |
| **Total** | **~159 new + 135 existing** | |

Benchmark: 4-6 new annotation tasks added to existing 38.
