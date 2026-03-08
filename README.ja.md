# Vibe

**LLMが100%の精度でコードを生成できるように設計されたプログラミング言語** + 軽量ゲームエンジン。

[English](README.md) | [한국어](README.ko.md)

## Vibeとは？

Vibeは、LLMが完璧な精度でコードを理解・生成できるように作られた新しいプログラミング言語です。Luaにトランスパイルされ、[LOVE 2D](https://love2d.org/)上で動作します。将来的には独自エンジンを目指しています。

```
let x: Float = 400.0
let y: Float = 300.0
let speed: Float = 200.0

fn update(dt: Float)
  if key_down("right")
    x = x + speed * dt
  if key_down("left")
    x = x - speed * dt
  if key_down("down")
    y = y + speed * dt
  if key_down("up")
    y = y - speed * dt

fn draw()
  draw_rect(x, y, 32, 32)
```

## 特徴

- **純粋なインデント** — `:`、`do`、`then`、`end`なし。インデントだけでブロックを定義します。
- **20個のキーワード** — `fn let const if else for in match return break continue enum struct and or not use yield trait has`
- **LLMファースト設計** — 最小限の構文曖昧性、一貫したパターン、コード生成を妨げるエッジケースがゼロ。
- **ゲーム対応** — 入力、描画、ゲームループのための組み込み関数。`fn update(dt)`と`fn draw()`がエンジンに直接マッピングされます。
- **Luaにトランスパイル** — 生成されたコードはLOVE 2Dで修正なしに実行できます。

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
npx tsx src/cli/cli.ts run examples/02_moving_player.vibe

# LOVEがPATHにない場合（macOS）
npx tsx src/cli/cli.ts run examples/02_moving_player.vibe
open -a love build
```

### テスト実行

```bash
npx vitest run
```

4つのスイートで67テスト：レキサー（22）、パーサー（22）、コードジェン（20）、E2E（3）。

## 言語の概要

### 変数

```
let x: Int = 42
const PI: Float = 3.14
```

### 関数

```
fn greet(name: String)
  draw_text("Hello " + name, 100, 100)
```

### 制御フロー

```
if health > 0
  draw_text("Alive", 10, 10)
else
  draw_text("Game Over", 10, 10)

for enemy in enemies
  draw_rect(enemy.x, enemy.y, 32, 32)

for i in range(10)
  draw_circle(i * 50, 100, 10)
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

## サンプル

`examples/`ディレクトリに段階的に複雑になる10個のプログラムがあります：

| # | ファイル | 説明 |
|---|----------|------|
| 01 | `hello_vibe.vibe` | テキスト表示 |
| 02 | `moving_player.vibe` | 矢印キーで移動 |
| 03 | `coin_collector.vibe` | 衝突とスコア |
| 04 | `enemy_ai.vibe` | ステートマシンAI |
| 05 | `scene_transition.vibe` | シーン管理 |
| 06 | `shooting_game.vibe` | 弾丸発射 |
| 07 | `platformer.vibe` | 重力とジャンプ |
| 08 | `inventory_system.vibe` | データ構造 |
| 09 | `particle_tween_effects.vibe` | パーティクルとトゥイーン |
| 10 | `coroutine_cutscene.vibe` | コルーチンカットシーン |

## アーキテクチャ

```
.vibeファイル → Lexer → Parser → CodeGen → Lua → LOVE 2D
```

トランスパイラはTypeScriptで書かれており、3つの独立したモジュールで構成されています：

- **Lexer** — Python式INDENT/DEDENTでトークン化
- **Parser** — 手書きの再帰下降パーサー、AST生成
- **CodeGen** — AST走査、LOVE 2D APIマッピングでLua出力

## プロジェクト構造

```
src/
  lexer/       — トークナイザー（INDENT/DEDENT、キーワード、演算子）
  parser/      — 再帰下降パーサー → AST
  codegen/     — AST → Luaコードジェネレーター
  cli/         — CLIエントリーポイント（vibe run）
  pipeline.ts  — グルー：lex | parse | generate
  e2e/         — E2Eテストとフィクスチャ
design/        — 言語とパイプラインの設計ドキュメント
examples/      — Vibeサンプルプログラム（.vibe）
research/      — 言語設計リサーチ
build/         — 生成されたLua出力（gitignore）
```

## ロードマップ

Vibeは現在**Phase 1 v0** — 最小トランスパイラパイプラインの段階です。今後の方向性：

- 型チェッカー
- `enum` / `match` / `struct` / `trait` / `has`
- アノテーションシステム（`@entity`、`@scene`、`@on`）
- モジュールシステム（`use`）
- ホットリロード
- ソースマップ（Luaエラー → Vibe行番号への逆マッピング）
- LSPサーバー
- 独自ゲームエンジン（Rust）

## ライセンス

ISC
