# Vibe Optional/Null-Safety 시스템 설계서

> Vibe에는 null/nil/undefined가 존재하지 않는다.
> "값이 없을 수 있음"은 반드시 타입 수준에서 선언되어야 한다.
> 이 문서는 core-keywords.md(확정)를 기준으로, type-system-keywords.md의 Optional 제안을 발전시킨 최종 설계이다.

---

## 0. 기존 문서 간 충돌 해소

core-keywords.md와 type-system-keywords.md 사이에 다음 불일치가 존재한다:

| 항목 | core-keywords.md (확정) | type-system-keywords.md (제안) |
|------|------------------------|-------------------------------|
| 함수 선언 | `fn` | `def` |
| 인터페이스 | `trait` + `impl` | `ability` + `has` |
| 블록 구분 | 들여쓰기 기반 (end/then 없음) | `end`/`then` 사용 |
| 가변성 | `let mut` (불변 기본) | `let` (가변 기본) |
| Optional 표기 | `Option[Entity]` (코드 예시) | `Entity?` (T? 접미사) |
| 패턴 매칭 arm | 직접 패턴 나열 | `is ... then` 구문 |

**본 문서의 기준**: core-keywords.md를 확정 사양으로 채택하되, type-system-keywords.md의 Optional 관련 분석(T? 접미사, ?. 체이닝, or 폴백)은 그 장점이 명확하므로 수용한다.

---

## 1. 접근법 분석

### Approach A: Rust-style Option 타입

```
let target: Option[Enemy] = find_nearest("enemy")
match target
    Some(enemy)
        attack(enemy)
    None
        idle()
```

**분석:**

| 항목 | 평가 |
|------|------|
| 추가 키워드/토큰 | `Some` (패턴/생성자), `none` (이미 확정 키워드). `Option`은 내장 타입이므로 키워드 아님. 실질 추가: 0-1개 |
| LLM 정확도 | 중간. `Option[Enemy]`는 7토큰(`Option`, `[`, `Enemy`, `]`). LLM이 Rust 데이터에서 학습한 패턴이지만, `Option<T>` vs `Option[T]`의 괄호 차이로 혼동 가능. `Some(enemy)` 대문자 시작이 Vibe의 소문자 키워드 관례와 충돌 |
| match 호환성 | 완벽. `match` + 패턴 나열이 core-keywords.md의 확정 구문과 일치 |
| 체이닝 | 불가능. `target.map(fn(e) e.weapon).map(fn(w) w.damage)` 같은 함수형 체이닝이 필요하여 매우 장황 |

**게임 예시 문제:**
```
# 레이캐스트 결과를 체이닝하려면
let hit: Option[RayHit] = raycast(from, dir)
let damage: i32 = match hit
    Some(h)
        match h.entity.get_component(Weapon)
            Some(w)
                w.damage
            None
                0
    None
        0
# 3중 중첩 match -- 게임 코드에서 빈번하게 발생하며 가독성이 극히 나쁨
```

**결론: 체이닝이 불가능하여 게임 코드에서 중첩이 폭발한다. 단독 사용은 부적합.**

---

### Approach B: Swift/Kotlin-style T? 설탕

```
let target: Enemy? = find_nearest("enemy")
if target exists
    attack(target)    # target은 이 블록 안에서 Enemy (언래핑됨)
```

**분석:**

| 항목 | 평가 |
|------|------|
| 추가 키워드/토큰 | `?` (타입 접미사), `exists` (새 키워드). `?.` (옵셔널 체이닝 연산자). 실질 추가: `exists` 1개 + 연산자 2개 |
| LLM 정확도 | 높음. `Enemy?`는 Swift/Kotlin/TypeScript에서 LLM이 가장 많이 학습한 nullable 패턴. `?.` 체이닝도 JS/TS/Kotlin에서 매우 풍부한 학습 데이터 |
| match 호환성 | 약함. `if exists`는 match와 별개의 메커니즘. Optional을 match에서 쓰려면 별도 패턴 필요 |
| 체이닝 | 우수. `player.weapon?.damage?.base_value or 0` 한 줄로 표현 |

**게임 예시:**
```
# 레이캐스트
let hit: RayHit? = raycast(from, dir)
if hit exists
    hit.entity.take_damage(10)    # hit은 RayHit로 언래핑

# 체이닝
let damage: i32 = player.weapon?.damage?.base_value or 0
```

**문제점:**
1. `exists`가 새 키워드 -- 키워드 예산 소모
2. `if target exists`에서의 "스마트 캐스트"(블록 안에서 자동 언래핑)는 LLM이 이해하기 어려운 암묵적 동작
3. `match`와의 통합이 불명확 -- "한 가지 방법" 원칙 위반 (if exists와 match 두 가지 방법)

**결론: 체이닝은 우수하지만, match와의 통합이 약하고 스마트 캐스트가 암묵적이다.**

---

### Approach C: Hybrid (T? 설탕 + 패턴 매칭)

```
let target: Enemy? = find_nearest("enemy")

# 간단한 체크
if target exists
    attack(target)

# 패턴 매칭도 가능
match target
    some(enemy)
        attack(enemy)
    none
        idle()
```

**분석:**

| 항목 | 평가 |
|------|------|
| 추가 키워드/토큰 | `?` (타입 접미사), `exists` (키워드), `some` (패턴), `?.` (연산자). 실질 추가: `exists` 1개 + `some` (패턴 또는 키워드) |
| LLM 정확도 | 위험. **동일한 작업에 두 가지 방법** (if exists vs match some/none). LLM이 어떤 것을 선택해야 하는지 매번 판단해야 함. "한 가지 방법" 원칙의 직접적 위반 |
| match 호환성 | 좋음. `some(enemy)`/`none` 패턴이 match와 자연스럽게 결합 |
| 체이닝 | 우수. Approach B와 동일 |

**문제점:**
이 접근법의 핵심 문제는 **LLM에게 선택지를 주는 것**이다:
```
# 방법 1: if exists
if target exists
    attack(target)

# 방법 2: match
match target
    some(enemy)
        attack(enemy)
    none
        idle()

# 방법 3: or 폴백
let t: Enemy = target or default_enemy()

# LLM: "어느 것을 써야 하지?" -- 비결정성 증가
```

Go의 설계 철학에서 가장 중요한 교훈: **동일한 일을 하는 두 가지 방법이 있으면, LLM은 두 방법을 섞어서 잘못된 코드를 만든다.**

**결론: 두 가지 방법의 공존은 LLM 정확도를 낮춘다.**

---

### Approach D: or-based 폴백 (명시적 Option 없음)

```
let target: Enemy = find_nearest("enemy") or default_enemy()
let config: Config = load("config.json") or Config.new()
```

**분석:**

| 항목 | 평가 |
|------|------|
| 추가 키워드/토큰 | 0개. `or`는 이미 확정 키워드 |
| LLM 정확도 | 높음 (단순 경우). `or`는 Python/Lua에서 이미 동일한 "폴백" 의미로 사용됨 |
| match 호환성 | 없음. 값이 없을 수 있다는 타입 정보가 사라지므로 패턴 매칭 불가 |
| 체이닝 | 불가. 중간 단계에서 값이 없는 경우를 타입으로 추적할 수 없음 |

**치명적 문제:**
```
# "값이 없을 수 있다"는 정보가 타입에 반영되지 않음
fn find_nearest(tag: str) -> Enemy    # 반환 타입이 Enemy?
    # ... 적을 못 찾으면 뭘 반환하지?
    # return ???  -- 반환할 것이 없다!
```

`or` 기반 폴백만으로는 "함수가 값을 반환하지 못할 수 있음"을 표현할 방법이 없다. null이 없으므로 반환할 "빈 값"이 존재하지 않는다.

**결론: 단독으로는 성립 불가. 보조 메커니즘으로만 유용.**

---

## 2. 최종 선택: Approach E (통합 설계)

### 핵심 원칙

위 4가지 접근법의 분석을 종합하면, 최적 설계는 다음 원칙을 따라야 한다:

1. **`T?` 접미사**로 Optional 타입 표현 (LLM 학습 데이터 극대화, 토큰 효율)
2. **`match` + `some`/`none` 패턴**이 Optional을 다루는 **유일한 1차 방법** ("한 가지 방법" 원칙)
3. **`?.` 체이닝과 `or` 폴백**은 **편의 연산자**로 제공 (match의 축약형)
4. **`exists` 키워드는 도입하지 않음** (키워드 예산 절약, match로 충분)
5. **`some`은 키워드가 아니라 패턴** (match 안에서만 의미를 가짐)

### 설계 전문

#### 2.1 타입 선언: `T?` 접미사

```
# T? 는 "이 값은 T이거나 없을 수 있다"
let target: Enemy? = find_nearest("enemy")
let save: SaveData? = load_file("save.dat")
let hit: RayHit? = raycast(origin, direction)
let weapon: Weapon? = player.get_component(Weapon)
```

**`T?`가 `Option[T]`보다 우월한 이유:**

| 기준 | `T?` | `Option[T]` |
|------|------|-------------|
| 토큰 수 | 2 (`Enemy`, `?`) | 4 (`Option`, `[`, `Enemy`, `]`) |
| LLM 학습 전이 | Swift, Kotlin, TypeScript의 `T?` 패턴 | Rust의 `Option<T>` 패턴 |
| 시각적 명확성 | `?`가 보이면 즉시 "없을 수 있음" 파악 | 타입명 앞에 `Option`을 읽어야 파악 |
| 중첩 가독성 | `List[Enemy?]` (적 목록, 각각 없을 수 있음) | `List[Option[Enemy]]` (괄호 중첩) |

**`T?`의 내부 표현**: 컴파일러 내부에서 `T?`는 `Option[T]` enum으로 취급된다. 사용자에게는 `T?`만 노출된다.

```
# 컴파일러 내부 표현 (사용자에게 노출되지 않음)
# enum Option[T]
#     some(value: T)
#     none
```

**규칙**: `T?`와 `T`는 완전히 다른 타입이다. 상호 호환되지 않는다.
```
let enemy: Enemy = find_nearest("enemy")     # 컴파일 에러! find_nearest는 Enemy?를 반환
let enemy: Enemy? = find_nearest("enemy")    # OK
let health: i32 = enemy.health               # 컴파일 에러! enemy는 Enemy?이므로 직접 접근 불가
```

#### 2.2 값 생성: `none`과 암묵적 래핑

**`none`**: 이미 확정된 키워드(core-keywords.md #22). "값 없음"을 나타낸다. `T?` 타입에만 할당 가능.

```
let target: Enemy? = none                    # OK
let target: Enemy = none                     # 컴파일 에러! Enemy 타입에 none 불가
```

**암묵적 래핑**: `T` 값은 `T?`에 직접 할당 가능. 별도의 `some()` 래핑이 필요 없다.

```
let enemy: Enemy = Enemy.new("Goblin", 50)
let maybe_enemy: Enemy? = enemy              # OK. 자동으로 some(enemy)로 래핑

fn find_nearest(tag: str) -> Enemy?
    for entity in entities
        if entity.tag == tag
            return entity                    # Entity를 반환하면 자동으로 some(entity)
    return none                              # 못 찾으면 none 반환
```

**왜 암묵적 래핑인가**: Rust에서 `Some(value)`을 매번 명시적으로 쓰는 것은 보일러플레이트다. Swift/Kotlin에서 `T` 값을 `T?` 변수에 직접 할당할 수 있는 패턴이 LLM에게 더 자연스럽다. 방향은 한쪽만 허용: `T` -> `T?`는 자동, `T?` -> `T`는 반드시 명시적 언래핑 필요.

#### 2.3 값 추출: `match`가 유일한 1차 방법

**핵심 결정**: Optional 값에서 내부 값을 꺼내는 **유일한 정식 방법은 `match`**이다.

```
let target: Enemy? = find_nearest("enemy")

match target
    some(enemy)
        attack(enemy)          # enemy: Enemy (언래핑됨)
    none
        idle()
```

**`some`은 키워드인가, 패턴인가?**

**패턴이다.** `some`은 키워드 예산을 소비하지 않는다. 이유:

1. `some`은 오직 `match` arm 내부에서만 특별한 의미를 가진다.
2. `match` 블록 밖에서 `some`은 일반 식별자로 사용 가능하다 (권장하지는 않음).
3. `none`은 이미 키워드이므로 어디서든 "값 없음"을 의미한다. 하지만 `some`을 키워드로 만들면 "값 있음"을 생성할 때 `some(value)` 구문이 필요해지는데, 2.2절의 암묵적 래핑으로 이 필요성이 사라진다.
4. match 안에서 `some(x)`은 `Enemy.Running(speed)` 같은 enum variant 패턴과 동일한 문법적 구조를 가진다. 새로운 문법 규칙이 불필요하다.

**`match`와의 통합이 자연스러운 이유:**

core-keywords.md에서 `match`는 이미 enum 패턴 매칭을 지원한다:
```
match state
    Idle
        play_animation("idle")
    Running(speed)
        move(speed * dt)
    Dead
        return
```

`T?`는 내부적으로 `enum Option[T]`이므로, 동일한 match 구문이 그대로 적용된다:
```
match find_nearest("enemy")
    some(enemy)                # Option의 some variant
        attack(enemy)
    none                       # Option의 none variant
        idle()
```

LLM 관점에서 **새로운 문법 규칙을 학습할 필요가 없다**. enum match를 이미 알고 있으면 Optional match도 자동으로 알게 된다.

#### 2.4 편의 메커니즘: `?.` 체이닝과 `or` 폴백

**`?.` (옵셔널 체이닝 연산자)**

```
# player.weapon이 none이면 전체 체인이 none을 반환
let damage: i32? = player.weapon?.damage?.base_value

# 메서드 호출에도 사용 가능
player.target?.take_damage(10)    # target이 none이면 아무것도 하지 않음
```

**`?.`의 의미론**: `a?.b`는 다음 match의 축약이다:
```
# a?.b 는 다음과 동일:
match a
    some(val)
        val.b               # 이것도 T? 타입일 수 있음
    none
        none
```

**`or` (폴백 연산자)**

`or`는 이미 확정된 키워드(core-keywords.md #15)이다. 불리언 논리합 외에, `T?` 타입에서 "none일 때의 기본값"을 제공하는 역할을 추가한다.

```
# target이 none이면 default_enemy() 호출
let target: Enemy = find_nearest("enemy") or default_enemy()

# 체이닝과 결합
let damage: i32 = player.weapon?.damage?.base_value or 0

# 세이브 파일 로딩
let save: SaveData = load_file("save.dat") or SaveData.new()
```

**`or`의 의미론**: `a or b`에서 `a`가 `T?` 타입이고 `b`가 `T` 타입이면, 결과는 `T` 타입이다.
```
# expr_a or expr_b 는 다음과 동일:
match expr_a
    some(val)
        val
    none
        expr_b
```

**`or`의 단락 평가**: `b`는 `a`가 `none`일 때만 평가된다. 이는 이미 `or`가 불리언에서 갖는 단락 평가 특성과 일치한다.

**왜 `or`인가 (`??`, `unwrap_or` 대신):**

| 대안 | 문제 |
|------|------|
| `??` (C#/JS) | 기호 2개, BPE 토크나이저에서 비효율, Vibe의 "자연어 키워드 우선" 원칙 위반 |
| `.unwrap_or(default)` (Rust) | 메서드 체이닝이 길어짐, 토큰 수 증가 |
| `or` | 이미 확정 키워드, 자연어 "A 또는 B", Python/Lua에서 동일 패턴 (`x = a or b`), 0 추가 키워드 |

#### 2.5 `?` 전파 연산자 (함수 내 조기 반환)

core-keywords.md의 연산자 목록에 `?`가 "에러 전파"로 이미 포함되어 있다. 이를 Optional에도 적용한다.

```
fn get_player_weapon_damage() -> i32?
    let player: Player? = find("Player")
    let weapon: Weapon? = player?.get_component(Weapon)
    let damage: i32? = weapon?.damage
    return damage

# ? 전파 연산자를 사용하면:
fn get_player_weapon_damage() -> i32?
    let player: Player = find("Player")?          # none이면 즉시 none 반환
    let weapon: Weapon = player.get_component(Weapon)?  # none이면 즉시 none 반환
    return weapon.damage                           # i32 반환 -> 자동으로 some(i32)
```

**`?` 전파 연산자의 의미론**: `expr?`에서 `expr`이 `T?` 타입일 때:
- `some(val)`이면: `val` (타입 `T`)로 언래핑하여 계속 진행
- `none`이면: 현재 함수에서 즉시 `none`을 반환

**제약**: `?` 전파 연산자는 반환 타입이 `T?`인 함수 안에서만 사용 가능. 그렇지 않으면 컴파일 에러.

---

## 3. 게임 시나리오별 완전한 예시

### 3.1 가장 가까운 적 찾기 (적이 없을 수 있음)

```
fn find_nearest_enemy(pos: Vec2, enemies: List[Enemy]) -> Enemy?
    let mut nearest: Enemy? = none
    let mut min_dist: f32 = 999999.0
    for enemy in enemies
        if not enemy.is_alive
            continue
        let dist: f32 = distance(pos, enemy.pos)
        if dist < min_dist
            min_dist = dist
            nearest = enemy              # 암묵적 래핑: T -> T?
    return nearest

# 사용: match 패턴 (정식 방법)
match find_nearest_enemy(player.pos, enemies)
    some(enemy)
        if distance(player.pos, enemy.pos) < ATTACK_RANGE
            attack(enemy)
        else
            move_toward(enemy.pos)
    none
        patrol()

# 사용: or 폴백 (기본값이 있을 때)
let target: Enemy = find_nearest_enemy(player.pos, enemies) or dummy_target
```

### 3.2 세이브 파일 로딩 (파일이 없을 수 있음)

```
fn load_save(path: str) -> SaveData?
    let file: File? = open_file(path)
    let content: str = file?.read_all() or return none
    let data: SaveData? = parse_json(content)
    return data

# 사용
match load_save("save.dat")
    some(save)
        restore_game(save)
        show_message("게임을 불러왔습니다")
    none
        start_new_game()
        show_message("새 게임을 시작합니다")

# 한 줄 폴백
let save: SaveData = load_save("save.dat") or SaveData.new()
```

### 3.3 엔티티에서 컴포넌트 가져오기 (없을 수 있음)

```
fn get_component(self, T: type) -> T?
    # 내부 구현: 컴포넌트 맵에서 조회
    ...

# 사용: 방어적 프로그래밍
match entity.get_component(Health)
    some(hp)
        hp.current = hp.current - damage
        if hp.current <= 0
            entity.destroy()
    none
        # Health 컴포넌트가 없는 엔티티는 데미지를 받지 않음
        pass

# 사용: ? 전파 (여러 컴포넌트가 모두 있어야 하는 경우)
fn apply_knockback(entity: Entity, force: Vec2) -> bool?
    let body: Body = entity.get_component(Body)?
    let health: Health = entity.get_component(Health)?
    body.velocity = body.velocity + force
    health.current = health.current - 1
    return true
```

### 3.4 레이캐스트 (아무것도 맞지 않을 수 있음)

```
fn raycast(from: Vec2, dir: Vec2) -> RayHit?
    # 물리 엔진에 레이 쏘기
    ...

# 사용: match
let hit: RayHit? = raycast(player.pos, player.facing)
match hit
    some(h)
        spawn_impact_effect(h.point)
        match h.entity.get_component(Health)
            some(hp)
                hp.current = hp.current - weapon_damage
            none
                spawn_ricochet_effect(h.point)
    none
        pass    # 빗나감

# 사용: ?. 체이닝으로 동일한 로직을 간결하게
let hit: RayHit? = raycast(player.pos, player.facing)
hit?.entity.get_component(Health)?.take_damage(weapon_damage)
# 레이가 빗나가거나, 맞은 대상에 Health가 없으면: 아무 일도 안 함
```

### 3.5 복합 체이닝: 플레이어 무기의 데미지 값

```
# 어떤 단계에서든 값이 없을 수 있음:
# - player가 존재하지 않을 수 있음
# - weapon이 장착되지 않았을 수 있음
# - damage 컴포넌트가 없을 수 있음

# ?. 체이닝 + or 폴백
let damage: i32 = find("Player")?.get_component(Weapon)?.damage?.base_value or 0

# 동일한 로직을 match로 풀어쓰면 (이해를 위한 참고):
let damage: i32 = match find("Player")
    some(player)
        match player.get_component(Weapon)
            some(weapon)
                match weapon.damage
                    some(dmg)
                        dmg.base_value
                    none
                        0
            none
                0
    none
        0

# ?. 체이닝이 왜 필수적인지 명확해진다: 4줄 vs 15줄
```

---

## 4. 설계 결정의 근거 종합

### 4.1 `some`은 키워드가 아니라 패턴이다

**근거:**

1. **키워드 예산 보존**: core-keywords.md에서 22개 확정 + game-domain-keywords.md에서 5개 = 27개. 예산 30개 중 3개 여유. `some`을 키워드로 만들면 여유가 2개로 줄어든다.

2. **암묵적 래핑으로 `some()`이 불필요**: `T` 값을 `T?` 변수에 직접 할당할 수 있으므로, 사용자가 `some(value)`을 명시적으로 쓸 일이 거의 없다.

3. **match 패턴과의 일관성**: match에서 enum variant를 매칭할 때, variant 이름은 키워드가 아니다:
```
match state
    Idle                 # Idle은 키워드가 아니라 enum variant
        ...
    Running(speed)       # Running은 키워드가 아니라 enum variant
        ...
```
마찬가지로 `some(enemy)`에서 `some`은 `Option` enum의 variant이지, 키워드가 아니다.

4. **`none`은 키워드인 이유**: `none`은 match 밖에서도 단독으로 사용된다 (`let x: T? = none`). 이것은 `true`/`false`처럼 "값 리터럴"이다. 반면 `some(x)`은 match 패턴에서만 등장하며, 값을 생성할 때는 암묵적 래핑을 사용한다.

### 4.2 `exists` 키워드는 도입하지 않는다

**근거:**

1. **"한 가지 방법" 원칙**: `if target exists`와 `match target / some(e) / none`이 동시에 존재하면, LLM이 매번 어떤 방법을 쓸지 선택해야 한다. 하나만 있으면 선택이 필요 없다.

2. **match가 더 강력하다**: `if exists`는 "있다/없다"만 검사하지만, match는 값을 바인딩하고 분기할 수 있다. 더 강력한 도구 하나만 제공하는 것이 낫다.

3. **`!= none`으로 대체 가능**: 단순히 "값이 있는지"만 확인하고 싶으면:
```
if target != none
    # target은 여전히 Enemy? 타입 -- 직접 접근 불가, match 필요
    match target
        some(e)
            attack(e)
```
하지만 이 패턴은 비효율적이므로, 처음부터 match를 쓰는 것이 올바르다.

4. **"값이 있으면 사용하기"는 항상 match로**: 게임 코드에서 "값이 있는지 확인"만 하고 "그 값을 사용하지 않는" 경우는 거의 없다. 값을 확인했으면 쓰는 것이 보통이고, 쓰려면 언래핑이 필요하며, 언래핑은 match에서 한다.

### 4.3 `or`의 이중 역할 (불리언 논리합 + Optional 폴백)

**우려**: `or`가 두 가지 의미를 가지면 모호하지 않은가?

**답: 타입으로 구분되므로 모호하지 않다.**

```
# 불리언 or: bool or bool -> bool
if is_alive or is_invincible
    continue_game()

# Optional or: T? or T -> T
let target: Enemy = find_nearest("enemy") or default_enemy()
```

컴파일러가 왼쪽 피연산자의 타입을 보고 결정한다:
- `bool`이면: 불리언 논리합 (단락 평가)
- `T?`이면: Optional 폴백 (none일 때 오른쪽 평가)

이는 Python에서 `or`가 이미 동일하게 동작하는 패턴이다:
```python
# Python에서도 or는 두 역할을 한다
x = None or "default"     # "default" (None 폴백)
y = True or False          # True (불리언 논리합)
```

LLM은 이 패턴을 Python 학습 데이터에서 이미 충분히 학습했다.

### 4.4 `?` 접미사의 이중 역할 (타입 표기 + 전파 연산자)

```
# 타입 표기에서의 ?: "이 타입은 none일 수 있다"
let target: Enemy? = find_nearest("enemy")

# 식에서의 ?: "none이면 즉시 none을 반환"
let player: Player = find("Player")?
```

**이 두 용법은 문맥으로 100% 구분된다:**
- 타입 위치 (`let x: T?`, `fn f() -> T?`): Optional 타입
- 식의 끝 (`expr?`): 전파 연산자

Rust에서 `?`가 정확히 이 두 역할을 하며(단, 타입 표기는 `Option<T>` 사용), Swift에서도 동일하다. LLM 학습 데이터가 풍부하다.

### 4.5 `?.` 체이닝 연산자

```
# ?.는 단일 연산자이다 (? + . 의 조합이 아님)
player.weapon?.damage?.base_value
```

**규칙:**
- `a?.b`: `a`가 `T?` 타입이면, `none`일 때 전체가 `none`. `some(val)`이면 `val.b` 반환.
- 결과 타입: `b`의 타입이 `U`이면 `a?.b`의 타입은 `U?`.
- 체이닝 가능: `a?.b?.c`에서 중간 어디서든 `none`이 나오면 전체가 `none`.

이는 JavaScript/TypeScript/Kotlin/Swift의 optional chaining과 동일한 의미론이다. LLM이 가장 많이 학습한 패턴 중 하나.

---

## 5. 키워드/토큰 영향 분석

### 추가되는 것

| 항목 | 유형 | 키워드 예산 소비 |
|------|------|-----------------|
| `none` | 키워드 | 0 (이미 확정 #22) |
| `or` | 키워드 | 0 (이미 확정 #15, 의미 확장만) |
| `?` (타입 접미사) | 연산자 | 0 (이미 연산자 목록에 포함) |
| `?` (전파 연산자) | 연산자 | 0 (이미 연산자 목록에 포함) |
| `?.` (체이닝) | 연산자 | 0 (새 연산자, 키워드 예산과 무관) |
| `some` | match 패턴 | 0 (키워드가 아님, Option enum의 variant) |

**키워드 예산 소비: 0개**

이 설계는 core-keywords.md에서 이미 확정된 키워드와 연산자만으로 Optional 시스템 전체를 구현한다. 새로운 키워드가 필요하지 않다.

### 추가되지 않는 것

| 항목 | 이유 |
|------|------|
| `exists` 키워드 | match로 대체. "한 가지 방법" 원칙 |
| `unwrap` 키워드/메서드 | 안전하지 않은 언래핑을 허용하면 null 안전성이 무너짐 |
| `Some` (대문자) 키워드 | 암묵적 래핑으로 불필요. `some`은 match 패턴으로만 존재 |
| `Option` 키워드 | `T?` 접미사가 대체. 내부 타입명일 뿐 키워드가 아님 |
| `if let` 구문 | Rust/Swift의 `if let Some(x) = expr` 대신 match 사용. 추가 구문 불필요 |
| `guard` 키워드 | Swift의 guard 대신 `?` 전파 연산자 사용 |

---

## 6. Lua 트랜스파일 매핑

Vibe는 초기에 Lua로 트랜스파일된다. Optional 시스템의 Lua 매핑:

```
-- Vibe                              -- Lua
let target: Enemy? = none            local target = nil
let target: Enemy? = enemy           local target = enemy

match target                         if target ~= nil then
    some(enemy)                          local enemy = target
        attack(enemy)                    attack(enemy)
    none                             else
        idle()                           idle()
                                     end

player.weapon?.damage or 0           (player.weapon ~= nil and player.weapon.damage) or 0

let p: Player = find("P")?           local p = find("P")
                                     if p == nil then return nil end
```

Lua에서 `nil`은 "값 없음"을 나타내므로, Vibe의 `none`이 Lua `nil`로 자연스럽게 매핑된다. 핵심 차이: Lua에서는 어떤 변수든 nil이 될 수 있지만, Vibe에서는 `T?` 타입만 none이 될 수 있으며 이를 컴파일러가 강제한다.

---

## 7. 전체 문법 요약 (BNF 추가분)

기존 core-keywords.md의 문법에 추가되는 규칙:

```ebnf
# 타입 시스템 확장
type           = base_type "?" ?                    # T 또는 T?
base_type      = NAME ("[" type_list "]") ?         # Enemy, List[Enemy], Map[str, i32]

# 패턴 매칭 확장 (Option 패턴)
pattern        = "some" "(" NAME ")"                # some(enemy)
               | "none"                              # none
               | NAME ("(" NAME ("," NAME)* ")")?   # 기존 enum variant 패턴

# 식 확장
postfix_expr   = primary ( "." NAME                 # 필드 접근
                         | "?." NAME                # 옵셔널 체이닝
                         | "(" arg_list ")"         # 함수 호출
                         | "?"                      # 전파 연산자
                         )*

# or 확장 (기존 논리합 + Optional 폴백)
or_expr        = and_expr ("or" and_expr)*          # 기존 규칙 그대로 유지
# 타입 검사기가 좌측이 bool인지 T?인지에 따라 의미 결정
```

추가 규칙 수: 3-4개. 기존 50개 미만 규칙 목표에 충분히 수용 가능.

---

## 8. LLM 생성 정확도 예측

### 패턴 수 비교

| 시스템 | Optional을 다루는 방법 수 | LLM 선택 부담 |
|--------|--------------------------|--------------|
| Rust | 6+ (match, if let, unwrap, unwrap_or, map, and_then, ?) | 높음 |
| Swift | 4+ (if let, guard let, ??, !, optional chaining) | 중간 |
| Kotlin | 4+ (?., ?:, let, !!) | 중간 |
| **Vibe** | **3 (match, ?./or, ?)** | **낮음** |

Vibe의 3가지 방법은 각각 명확히 다른 상황에서 사용된다:

| 상황 | 사용할 도구 | 예시 |
|------|------------|------|
| 있으면 A, 없으면 B (분기) | `match` | `match target / some(e) -> attack(e) / none -> idle()` |
| 없으면 기본값 (폴백) | `or` | `let t = find("P") or default` |
| 중간 단계가 없을 수 있음 (체이닝) | `?.` | `player.weapon?.damage or 0` |
| 없으면 함수 종료 (전파) | `?` | `let p = find("P")?` |

각 도구의 용도가 겹치지 않으므로, LLM이 "어느 것을 쓸지" 고민할 필요가 없다.

### 예측되는 정확도

```
패턴                              예측 정확도    근거
let x: T? = none                  99%+          Python의 None 할당 패턴 직접 전이
match x / some(v) / none          95%+          Rust match + enum 패턴 전이
x?.field or default               98%+          JS/TS optional chaining + Python or 전이
let y: T = expr?                  90%+          Rust ? 연산자 전이 (약간 변형)
fn f() -> T? ... return none      97%+          Rust Option 반환 패턴 전이
```

가장 낮은 예측 정확도(90%)인 `?` 전파 연산자도 Rust에서 이미 검증된 패턴이며, Vibe의 문법이 Rust보다 단순하므로 실제로는 더 높을 것으로 예상된다.

---

## 9. 열린 질문

### 9.1 `T??` (이중 Optional)은 허용하는가?

**제안: 허용하지 않는다.** `Option[Option[T]]`는 게임 코드에서 사용되는 경우가 사실상 없으며, 허용하면 `?.` 체이닝의 타입 추론이 복잡해진다. 컴파일러가 `T??`를 `T?`로 자동 평탄화(flatten)한다.

### 9.2 `or`의 우측에 `T?`가 올 수 있는가?

```
let a: Enemy? = find("A")
let b: Enemy? = find("B")
let target: Enemy? = a or b          # 둘 다 T?이면 결과도 T?
let target2: Enemy = a or b or default_enemy()  # 마지막이 T이면 결과는 T
```

**제안: 허용한다.** `T? or T? -> T?`, `T? or T -> T`. 이는 Python/JavaScript의 `or`/`||` 체이닝과 동일한 패턴이다.

### 9.3 컬렉션에서의 Optional

```
let enemies: List[Enemy?] = get_all_enemies()     # 목록의 각 요소가 없을 수 있음
let enemies: List[Enemy]? = get_enemy_list()       # 목록 자체가 없을 수 있음
```

두 타입은 명확히 다르며, 둘 다 유효한 사용 사례가 있다. 컴파일러가 구분한다.

### 9.4 Result 타입과의 관계

`T?`는 "값이 없을 수 있음"을 표현한다. "값이 없는 이유"가 필요하면 Result 타입이 필요하다. Result 타입은 별도 설계서에서 다루지만, 기본 구조를 미리 제시한다:

```
# Result[T, E]: 성공(T) 또는 실패(E)
fn load_level(path: str) -> Result[Level, LoadError]
    let data: str = read_file(path)?               # ? 전파는 Result에도 동작
    let level: Level = parse_level(data)?
    return level

# T?는 Result[T, ()]의 축약으로 볼 수 있음
# 즉, "실패 이유 없이 그냥 없음"
```

---

## 10. 요약

### 최종 설계 한 줄 요약

> **`T?` 타입 접미사 + `match some/none` 패턴 매칭 + `?.` 체이닝 + `or` 폴백 + `?` 전파 연산자. 키워드 추가 0개.**

### 확정 사항

| 항목 | 결정 |
|------|------|
| Optional 타입 표기 | `T?` (접미사) |
| "값 없음" 리터럴 | `none` (이미 확정 키워드) |
| "값 있음" 생성 | 암묵적 래핑 (`T` -> `T?` 자동 변환) |
| 값 추출 (1차 방법) | `match target / some(x) -> ... / none -> ...` |
| 체이닝 | `?.` 연산자 |
| 폴백 | `or` 키워드 (이미 확정, 의미 확장) |
| 조기 반환 전파 | `?` 연산자 (이미 확정) |
| `some`의 지위 | match 패턴 (키워드 아님) |
| `exists`의 지위 | 도입하지 않음 |
| 키워드 예산 소비 | 0개 |
| 새 연산자 | `?.` 1개 |
