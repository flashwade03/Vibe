# Vibe

**LLMが100%の精度でコードを生成できるように設計されたプログラミング言語** + 軽量ゲームエンジン。

[English](README.md) | [한국어](README.ko.md)

## Vibeとは？

Vibeは、LLMが完璧な精度でコードを理解・生成できるように作られた新しいプログラミング言語です。Luaにトランスパイルされ、[LOVE 2D](https://love2d.org/)上で動作します。将来的には独自エンジンを目指しています。

```
struct Ball
    x: Float
    y: Float
    vx: Float
    vy: Float
    r: Float

let balls: List[Ball] = []

fn update(dt: Float)
    for b in balls
        b.x = b.x + b.vx * dt
        b.y = b.y + b.vy * dt
        if b.x < b.r or b.x > 800.0 - b.r
            b.vx = -b.vx
        if b.y < b.r or b.y > 600.0 - b.r
            b.vy = -b.vy

fn draw()
    set_color(0.2, 0.8, 1.0)
    for b in balls
        draw_circle(b.x, b.y, b.r)
    set_color(1.0, 1.0, 1.0)
    draw_text("Balls: " + str(len(balls)), 10.0, 10.0)
```

## 特徴

- **純粋なインデント** — `:`、`do`、`then`、`end`なし。インデントだけでブロックを定義します。
- **20個のキーワード** — `fn let const if else for in match return break continue enum struct and or not use yield trait has`
- **LLMファースト設計** — 最小限の構文曖昧性、一貫したパターン、コード生成を妨げるエッジケースがゼロ。
- **構造体・列挙型・トレイト** — `struct Player has Drawable`、`enum GameState`、`Enum.Variant`パターンマッチ。
- **ゲーム対応** — 入力、描画、ゲームループのための組み込み関数。`fn update(dt)`と`fn draw()`がエンジンに直接マッピングされます。
- **Luaにトランスパイル** — 生成されたコードはLOVE 2Dで修正なしに実行できます。

## LLMベンチマーク

38個のゲームタスク × 4段階難易度（Easy/Medium/Hard/Trap）、3言語 × 2 LLMでパーサー基盤の検証。

| 言語 | Gemini | OpenAI |
|------|--------|--------|
| **Vibe** | **100% (38/38)** | 84% (32/38) |
| Python-Pygame | 100% (38/38) | 100% (38/38) |
| Lua-LOVE | 100% (38/38) | 89% (34/38) |

**トークン効率**（Gemini平均）：Vibe **161** vs Python 209 vs Lua 201。シンプルなタスクではPythonより47%少ないトークンでコードを生成します。

OpenAIの6件のVibe失敗はすべて**Training Data Gravity** — 明確な指示にもかかわらず、Pythonパターン（リスト内包表記、dict リテラル）に回帰する現象。

[ベンチマーク結果の詳細](vibe-lang/benchmark/results.md)

## クイックスタート

### 前提条件

- [Node.js](https://nodejs.org/) 18+
- [LOVE 2D](https://love2d.org/) インストール済み（macOS: `brew install love`）

### インストールと実行

```bash
git clone https://github.com/flashwade03/Vibe.git
cd Vibe
npm install

# .vibeファイルをトランスパイルして実行
npx tsx vibe-lang/src/cli/cli.ts run vibe-lang/examples/demo_bouncing_balls.vibe
```

### テスト実行

```bash
npx vitest run
```

4つのスイートで129テスト：レキサー（22）、パーサー（51）、コードジェン（52）、E2E（4）。

## 言語の概要

### 変数

```
let x: Int = 42
const PI: Float = 3.14
```

### 関数

```
fn greet(name: String)
    draw_text("Hello " + name, 100.0, 100.0)
```

### 制御フロー

```
if health > 0
    draw_text("Alive", 10.0, 10.0)
else
    draw_text("Game Over", 10.0, 10.0)

for enemy in enemies
    draw_rect(enemy.x, enemy.y, 32.0, 32.0)

match state
    GameState.Menu
        draw_text("Press SPACE", 300.0, 300.0)
    GameState.Playing
        draw_text("Playing!", 300.0, 300.0)
```

### 構造体とトレイト

```
struct Player has Drawable
    x: Float
    y: Float
    size: Float

    fn draw(self_x: Float, self_y: Float)
        draw_rect(self_x, self_y, 32.0, 32.0)
```

### 列挙型とマッチ

```
enum GameState
    Menu
    Playing
    GameOver

let state: GameState = GameState.Menu

match state
    GameState.Menu
        draw_text("Menu", 300.0, 300.0)
    GameState.Playing
        draw_text("Play", 300.0, 300.0)
    GameState.GameOver
        draw_text("Over", 300.0, 300.0)
```

### ブール演算子

```
if alive and not invincible
    take_damage()
```

### 組み込み関数（v0）

| Vibe | 説明 |
|------|------|
| `key_down(key)` | キー入力の確認 |
| `draw_rect(x, y, w, h)` | 塗りつぶし矩形の描画 |
| `draw_circle(x, y, r)` | 塗りつぶし円の描画 |
| `draw_text(text, x, y)` | テキストの描画 |
| `set_color(r, g, b)` | 描画色の設定 |
| `len(list)` | リストの長さ |
| `append(list, item)` | リストに項目を追加 |
| `abs(x)` / `min(a,b)` / `max(a,b)` | 数学関数 |
| `rand_int(a, b)` / `rand_float(a, b)` | 乱数生成 |
| `print(value)` | コンソール出力 |

## アーキテクチャ

```
.vibeファイル → Lexer → Parser → CodeGen → Lua → LOVE 2D
```

トランスパイラはTypeScriptで書かれており（約3,500行）、3つの独立したモジュールで構成されています：

- **Lexer**（648行） — Python式INDENT/DEDENTでトークン化
- **Parser**（1,551行） — 手書きの再帰下降パーサー、AST生成
- **CodeGen**（686行） — AST走査、LOVE 2D APIマッピングでLua出力
- **Feedback**（492行） — LLMリトライのためのError-Feedback Loop（Layer 3防御）

## プロジェクト構造

```
vibe-lang/               — Vibe言語（言語関連ファイル全体）
  src/                   — トランスパイラ（lexer, parser, codegen, feedback, cli）
  grammar/               — PEG文法定義
  examples/              — Vibeサンプルプログラム（.vibe）
  benchmark/             — LLMベンチマーク（38タスク × 3言語 × 2 LLM）
design/                  — 設計ドキュメント
research/                — 言語設計リサーチ
build/                   — 生成されたLua出力（gitignore）
```

## ロードマップ

Vibe v0完了 — トランスパイラパイプラインがstruct、enum、trait、match、ゲームループをエンドツーエンドで処理します。次のステップ：

- 型チェッカー（アノテーションはパースされるが現在は無視）
- アノテーションランタイム（`@entity`、`@scene`、`@on`）
- モジュールシステム（`use`）
- ランタイムベンチマーク検証（現在はパーサー検証のみ）
- ホットリロード
- ソースマップ（Luaエラー → Vibe行番号への逆マッピング）
- LSPサーバー
- 独自ゲームエンジン（Rust）

## ライセンス

ISC
