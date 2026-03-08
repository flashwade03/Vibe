# Vibe 제네릭 타입 문법 설계서

> 이 문서는 Vibe 언어의 **제네릭(파라미터화) 타입 표기법**을 결정한다.
> 대상: `List`, `Map`, `Option`, `Set`, `Queue` 등 내장 컬렉션 타입 한정.
> 사용자 정의 제네릭은 허용하지 않는다.

---

## 0. 전제 조건 정리

분석에 앞서, 기존 설계 문서에서 확인된 관련 결정사항을 정리한다.

### 이미 확정된 사항

| 출처 | 결정 |
|------|------|
| `core-keywords.md` | 확정 키워드 22개. `of`는 포함되어 있지 않음 |
| `core-keywords.md` 연산자 목록 | `<> (제네릭)` → `[]`로 대체 명시: `List[Item]`, `Map[str, i32]` |
| `core-keywords.md` 코드 예시 | `List[Item]`, `List[Enemy]`, `Option[Entity]` 등 대괄호 문법을 일관 사용 |
| `core-keywords.md` | `impl Trait for Type` 패턴 채택. `trait`, `impl` 키워드 확정 |
| `core-keywords.md` | 들여쓰기 기반 블록 (`end` 키워드 없음) |
| `core-keywords.md` | `none`은 키워드, `Option[T]` 전용 |
| `LLM_CODE_GENERATION_ANALYSIS.md` | 설계 원칙 #4: "제네릭은 `<>` 대신 키워드 기반 (예: `of` 키워드)" 제안 |
| `type-system-keywords.md` | `of` 키워드를 제안하며 `List of Item` 문법 사용 |

### 문서 간 충돌

**`core-keywords.md`와 `type-system-keywords.md`가 정면으로 충돌한다:**

- `core-keywords.md`: `List[Item]` (대괄호). `of`는 키워드 목록에 없음. `trait`/`impl` 채택.
- `type-system-keywords.md`: `List of Item` (of 키워드). `ability`/`has` 채택. `impl` 제거.

`core-keywords.md`가 최종 확정 문서로서 더 최신이고 상세한 근거를 제시하므로, **`core-keywords.md`의 결정을 기준으로** 분석한다. 단, 이 분석의 목적은 그 결정이 정말 최선인지를 재검증하는 것이다.

### 제네릭 사용 범위의 재확인

Vibe에서 제네릭은 **내장 컬렉션 타입에만 한정**된다:

| 타입 | 용도 | 파라미터 |
|------|------|----------|
| `List` | 순서 있는 컬렉션 | 1개 (`List[T]`) |
| `Map` | 키-값 매핑 | 2개 (`Map[K, V]`) |
| `Option` | 값 있음/없음 | 1개 (`Option[T]`) 또는 `T?` 축약 |
| `Set` | 중복 없는 집합 | 1개 (`Set[T]`) |
| `Queue` | FIFO 큐 | 1개 (`Queue[T]`) |

사용자 정의 `struct Pool of T` 같은 것은 **허용하지 않는다**. 이 제약이 분석에 크게 영향을 미친다.

---

## 1. 다섯 가지 접근법 상세 분석

---

### 접근법 A: 대괄호 `List[String]`

```
let items: List[String] = ["sword", "shield"]
let stats: Map[String, Int] = {"hp": 100, "mp": 50}
let target: Option[Enemy] = find_nearest("enemy")
```

#### 1. 모호성 분석

**잠재적 충돌: 인덱싱 연산자 `[]`**

```
# 타입 위치 vs 값 위치의 구분
let x: List[Int] = [1, 2, 3]   # 타입 위치: 제네릭 파라미터
let y = x[0]                    # 값 위치: 인덱싱

# LLM이 혼동할 수 있는 패턴
let enemies: Map[String, List[Enemy]]   # 타입
let first = enemies["goblin"][0]         # 인덱싱
```

**모호성 평가: 낮음.**

파서 관점에서 `[...]`가 타입 문맥(`:` 뒤)에서 나오면 제네릭 파라미터, 값 문맥에서 나오면 인덱싱이다. 이 구분은 **문법적으로 결정론적**이다. `:` 뒤에서만 `List[T]`가 나오므로 파서가 절대 혼동하지 않는다. LLM도 Python의 `list[int]` (PEP 585), Kotlin의 `List<Int>` 등에서 "타입 위치의 괄호는 제네릭"이라는 패턴을 충분히 학습했다.

**Vibe 특유의 장점:** Vibe에는 딕셔너리/배열 접근에 `[]`를 사용하되, 타입 어노테이션은 항상 `변수: 타입` 형태이므로 위치만으로 완벽히 구분된다.

#### 2. LLM 정확도

**매우 높음.**

- Python 3.9+ (`list[int]`, `dict[str, int]`): LLM 훈련 데이터에서 압도적으로 풍부
- Kotlin (`List<Int>` 대신 `List[Int]`는 아니지만, 대괄호 패턴 자체는 친숙)
- TypeScript의 인덱스 시그니처 (`Record<string, number>` 대신 `{ [key: string]: number }`)
- **핵심: Python 3.9+ 이후 `list[int]`가 표준이 되면서 LLM 훈련 데이터에 `타입[파라미터]` 패턴이 급증**

LLM이 `List[String]`을 보면:
1. Python의 `list[str]` 패턴에서 전이 학습
2. `[` 다음에 타입 이름이 올 것을 높은 확률로 예측
3. `Map[K, V]`의 2-파라미터 패턴도 Python의 `dict[str, int]`에서 전이

#### 3. 가독성

**양호.**

```
# 단일 파라미터: 간결하고 명확
let names: List[String] = ["Alice", "Bob"]
let ids: Set[Int] = {1, 2, 3}

# 이중 파라미터: 쉼표로 구분, 직관적
let scores: Map[String, Int] = {"alice": 100}

# 영어로 읽기: "List of String" 이라고 자연스럽게 읽히지는 않지만,
# 프로그래머에게는 "List, parameterized by String"으로 즉시 인식됨
```

자연어 가독성은 `of` 키워드보다 떨어지지만, 프로그래밍 맥락에서의 가독성은 충분하다.

#### 4. 중첩

```
# 희귀하지만 가능한 케이스
let grouped: Map[String, List[Int]] = {"scores": [1, 2, 3]}
let nested: List[Map[String, List[Int]]] = []

# 읽기 어려움이 있지만, 중첩의 시작과 끝이 명확
# 대괄호 매칭은 LLM이 잘 학습한 패턴 (JSON 파싱 등)
```

중첩 시 `]]`가 연속될 수 있지만, JSON의 `]]` 패턴에서 LLM이 충분히 학습한 구조다.

#### 5. 토큰 효율

```
List[String]          # 토큰: List + [ + String + ]  = 4 토큰
Map[String, Int]      # 토큰: Map + [ + String + , + Int + ]  = 6 토큰
Option[Enemy]         # 토큰: Option + [ + Enemy + ]  = 4 토큰
```

#### 6. Vibe 문법과의 일관성

**높음.**

- `[]`는 이미 Vibe에서 리스트 리터럴에 사용: `let items = [1, 2, 3]`
- 타입 위치에서 `[T]`가 파라미터를 의미하는 것은 Python 3.9+와 동일한 관례
- 연산자 목록에서 `<>`를 제거하고 `[]`를 사용한다고 **이미 명시**
- `core-keywords.md`의 모든 코드 예시가 이 문법을 사용 중

---

### 접근법 B: `of` 키워드 `List of String`

```
let items: List of String = ["sword", "shield"]
let stats: Map of String, Int = {"hp": 100, "mp": 50}
let target: Option of Enemy = find_nearest("enemy")
```

#### 1. 모호성 분석

**잠재적 충돌: `or` 키워드와의 시각적 유사성, 복수 파라미터 구분 모호성**

```
# Map의 두 번째 파라미터는 어디까지인가?
let x: Map of String, Int           # OK: 2개 파라미터
let y: Map of String, List of Int   # 파서 문제: "List of Int"가 두 번째 파라미터?
                                     # 아니면 "List"가 두 번째이고 "of Int"는 뭔가?

# type-system-keywords.md의 해결책: `to` 키워드 도입
let z: Map of String to Int         # 명확하지만, `to`라는 추가 키워드/관례 필요
let w: Map of String to List of Int # "List of Int"가 값 타입이라는 것이 명확

# 그러나 이제 `to`도 파서가 알아야 할 새로운 규칙이다
```

**모호성 평가: 중간~높음.**

복수 파라미터 처리에서 근본적인 구문적 모호성이 존재한다. `Map of K, V`에서 `V`가 `List of Int`처럼 자체적으로 `of`를 포함하면 파싱이 불확실해진다. `to` 키워드로 해결할 수 있지만, 이는 `Map` 타입에만 적용되는 특수 규칙이 된다 -- "한 가지 방법" 원칙 위반.

또한 `in` 키워드와의 설계적 충돌도 있다. `core-keywords.md`에서 `in`은 "오직 `for` 루프 전용"이라 결정했고, `of`도 동일하게 "오직 제네릭 전용"으로 제한해야 한다. 그런데 `of`는 자연어에서 "~의"라는 매우 범용적인 의미를 가지므로, LLM이 다른 맥락에서 `of`를 사용하려 할 유혹이 있다.

#### 2. LLM 정확도

**높음, 하지만 함정이 있음.**

장점:
- `List of String`은 영어 "list of strings"와 거의 동일 -- LLM의 자연어 능력이 직접 전이
- `of`는 BPE 토크나이저에서 단일 토큰, 2글자로 매우 효율적

단점:
- **기존 프로그래밍 언어에서 `Type of Type` 패턴이 거의 없다.** 이는 전이 학습의 근본적 약점이다.
- Pascal의 `array of integer`가 유사하지만, LLM 훈련 데이터에서 Pascal 비중은 극히 낮다.
- LLM이 `Map of String to Int`를 생성할 때 `to`를 빠뜨리거나 `Map of String, Int`로 생성할 가능성이 있다. 두 가지 변형이 존재하면 비결정성이 증가한다.

**핵심 우려:** `of` 문법은 자연어로서는 완벽하지만, **프로그래밍 언어로서의 훈련 데이터가 부족하다**. Vibe는 새로운 언어이므로 기존 언어와의 교차 전이에 크게 의존하는데, `of` 문법은 이 전이 효과가 약하다.

#### 3. 가독성

**매우 높음.**

```
let items: List of String = ["sword", "shield"]
# 영어: "items is a list of string"
# 가독성에서는 모든 접근법 중 최고

let target: Option of Enemy = find_nearest("enemy")
# 영어: "target is an option of enemy"
# 자연스러움
```

자연어에 가장 가까워 비프로그래머도 직관적으로 이해할 수 있다. 이것이 `of` 접근법의 가장 큰 강점이다.

#### 4. 중첩

```
# 중첩 시 어색해짐
let grouped: Map of String to List of Int
# "Map of String to (List of Int)" -- 괄호 없이 우선순위가 명확한가?

let nested: List of Map of String to List of Int
# 이 경우 파싱이 매우 어렵다
# "List of (Map of String to (List of Int))" 인지
# "(List of Map) of String to (List of Int)" 인지

# 해결: 괄호 허용
let nested: List of (Map of String to List of Int)
# 그런데 이러면 결국 구분자가 필요하고, `of`의 "자연어" 장점이 퇴색
```

**중첩 시 심각한 가독성/파싱 문제가 발생한다.** 이것이 `of` 접근법의 가장 큰 약점이다.

#### 5. 토큰 효율

```
List of String          # 토큰: List + of + String  = 3 토큰 (A보다 1 적음)
Map of String to Int    # 토큰: Map + of + String + to + Int  = 5 토큰 (A보다 1 적음)
Map of String, Int      # 토큰: Map + of + String + , + Int  = 5 토큰 (A보다 1 적음)
Option of Enemy         # 토큰: Option + of + Enemy  = 3 토큰 (A보다 1 적음)
```

단일 파라미터에서는 대괄호보다 1토큰 효율적이다. 그러나 키워드 예산에서 `of`를 1개 소모한다.

#### 6. Vibe 문법과의 일관성

**낮음~중간.**

- `of`는 현재 확정된 22개 키워드에 포함되어 있지 않다. 추가하면 23개가 된다.
- `core-keywords.md`의 모든 코드 예시가 이미 `List[T]` 문법을 사용 중이다. 전면 변경이 필요하다.
- `in`이 "오직 for 루프 전용"인 것처럼 `of`가 "오직 제네릭 전용"이 되면, 키워드의 용도가 극도로 제한적이다. 키워드 예산 대비 가치가 낮다.
- `has`가 게임 도메인 키워드로 이미 제안되어 있는데, `struct Player has Damageable`의 `has`와 `List of Item`의 `of`가 둘 다 "키워드 + 타입" 패턴이지만 완전히 다른 의미를 가진다. 이 불일관성이 LLM을 혼동시킬 수 있다.

---

### 접근법 C: 꺾쇠괄호 `List<String>`

```
let items: List<String> = ["sword", "shield"]
let stats: Map<String, Int> = {"hp": 100, "mp": 50}
let target: Option<Enemy> = find_nearest("enemy")
```

#### 1. 모호성 분석

**심각한 충돌: 비교 연산자 `<`, `>`**

```
# 타입 위치에서는 명확하지만...
let x: List<Int> = [1, 2, 3]           # OK

# 표현식에서 제네릭 함수 호출이 있다면?
# Vibe에서는 사용자 정의 제네릭이 없으므로 이 문제는 발생하지 않지만,
# LLM은 다른 언어 습관에서 이런 패턴을 생성할 수 있다

# 가장 큰 문제: LLM 토크나이저
# `<`와 `>`는 HTML 태그, 비교 연산, 제네릭의 3가지 의미로 학습됨
# BPE 토크나이저에서 `<String>` 이 HTML 태그와 혼동될 수 있음
```

**모호성 평가: 높음.**

Vibe에서 사용자 정의 제네릭이 없으므로 파서 수준의 모호성은 제한적이다. 그러나 **LLM 수준의 모호성**이 심각하다. `<>`는 LLM 훈련 데이터에서 (1) HTML 태그, (2) 비교 연산자, (3) 제네릭 타입 파라미터의 3가지 의미로 학습되어 있다. `LLM_CODE_GENERATION_ANALYSIS.md`에서 이미 이 문제를 지적하고 `<>`를 제거하도록 권고했다.

`core-keywords.md`에서도 **명시적으로 `<>`를 제거**했다.

#### 2. LLM 정확도

**높음 (패턴 인식), 하지만 토큰 효율이 나쁨.**

- Rust, Java, TypeScript, C#, C++ 등 주류 정적 타입 언어에서 `<>` 제네릭이 표준
- LLM 훈련 데이터에서 `List<String>` 패턴이 매우 풍부
- 그러나 `<`, `>` 각각이 비교 연산자로도 쓰이므로 토크나이저 혼동 가능

#### 3. 가독성

**프로그래머에게는 친숙함. 비프로그래머에게는 기호가 과다.**

#### 4. 중첩

```
let nested: List<Map<String, List<Int>>>
# C++의 `>>` 문제는 현대 언어에서 해결되었지만
# 시각적으로 `>>>` 같은 연쇄가 가독성을 해친다
```

#### 5. 토큰 효율

대괄호와 동일 (4토큰). 그러나 `<`와 `>`가 BPE에서 비교 연산자와 같은 토큰일 수 있어 문맥 혼동 우려.

#### 6. Vibe 문법과의 일관성

**이미 제거 결정됨.** `core-keywords.md`에서 명시적으로 배제.

**결론: 접근법 C는 기존 설계 결정에 의해 이미 배제되었다. 이하 분석에서 제외.**

---

### 접근법 D: 점 표기법 `List.String`

```
let items: List.String = ["sword", "shield"]
let stats: Map.String.Int = {"hp": 100, "mp": 50}
```

#### 1. 모호성 분석

**심각한 충돌: 필드/모듈 접근 `.`**

```
# 점은 이미 Vibe에서 필드/메서드 접근에 사용
player.position.x    # 필드 접근
List.String          # 제네릭 파라미터? 아니면 List 모듈의 String 하위 타입?

# LLM은 이 두 가지를 구분할 수 없다
# "List.String"이 "List라는 모듈의 String이라는 타입"으로 해석될 수 있다
# Vibe에서 `.`은 "경로 구분자와 통일"이라고 명시되어 있으므로 직접 충돌
```

**모호성 평가: 치명적.**

복수 파라미터 (`Map.String.Int`)에서 "첫 번째 파라미터와 두 번째 파라미터의 경계가 어디인가?"를 알 수 없다. `Map.String.Int`가 `Map<String, Int>`인지, `Map.String`이라는 타입의 `Int` 필드인지 구분 불가.

**결론: 접근법 D는 Vibe의 `.` 연산자와 치명적으로 충돌한다. 이하 분석에서 제외.**

---

### 접근법 E: 소괄호 `List(String)`

```
let items: List(String) = ["sword", "shield"]
let stats: Map(String, Int) = {"hp": 100, "mp": 50}
let target: Option(Enemy) = find_nearest("enemy")
```

#### 1. 모호성 분석

**심각한 충돌: 함수 호출 `()`**

```
# 타입 위치에서는 구분 가능하지만...
let x: List(Int) = [1, 2, 3]       # 타입: 제네릭
let y = List(1, 2, 3)               # 값: 생성자 호출? 함수 호출?

# 문제: Vibe에서 구조체 리터럴/생성자가 `Type(args)` 형태라면
# `List(Int)`가 "Int를 인자로 받는 List 생성자 호출"인지
# "Int로 파라미터화된 List 타입"인지 혼동
```

**모호성 평가: 높음.**

`core-keywords.md`에서 구조체 인스턴스 생성을 `Vec2 { x: 0, y: 0 }` 또는 `Type.new()` 형태로 한다면 충돌이 줄어들지만, 여전히 LLM 관점에서 `List(String)`은 "List 함수에 String을 전달하는 호출"로 해석될 가능성이 높다. 특히 Python에서 `list("hello")`가 유효한 호출이므로, 전이 학습에서 혼동이 심하다.

**결론: 접근법 E는 함수 호출과의 모호성이 심각하다. 이하 분석에서 제외.**

---

## 2. 최종 후보: A (대괄호) vs B (of 키워드) 상세 비교

C, D, E가 제외되었으므로, 실질적 경쟁은 **A (대괄호)와 B (of 키워드)** 사이다.

### 2.1 일곱 가지 평가 기준 비교표

| 기준 | A: `List[String]` | B: `List of String` | 승자 |
|------|-------------------|---------------------|------|
| **파서 모호성** | 없음. `:`뒤 타입 문맥에서만 발생. 인덱싱은 값 문맥 | Map 복수 파라미터에서 모호. 중첩 시 파싱 어려움 | **A** |
| **LLM 전이 학습** | Python 3.9+ `list[int]` 패턴 풍부. Kotlin, Scala도 `[]` 사용 | 프로그래밍 언어 전례 거의 없음 (Pascal `array of` 정도) | **A** |
| **자연어 가독성** | 프로그래밍 관례로서 충분하지만 자연어와는 거리 있음 | 영어 "list of string"과 거의 동일. 최고의 가독성 | **B** |
| **중첩 가독성** | `Map[String, List[Int]]` -- 괄호 매칭으로 명확 | `Map of String to List of Int` -- 경계 모호 | **A** |
| **토큰 효율** | 4토큰 (`List`+`[`+`String`+`]`) | 3토큰 (`List`+`of`+`String`). 단, Map은 `to` 추가로 5토큰 | **B** (근소) |
| **키워드 예산** | 추가 키워드 0개 | `of` 키워드 1개 추가 (22 -> 23개). `to`도 사실상 추가 | **A** |
| **기존 문서 일관성** | `core-keywords.md`의 모든 예시와 일치 | 전면 변경 필요 | **A** |

**점수: A가 7개 기준 중 5개에서 승리, B가 2개에서 승리.**

### 2.2 결정적 논거: "왜 A가 B를 이기는가"

#### 논거 1: 중첩 시 B의 파싱 문제는 해결 불가능하다

```
# A의 중첩: 명확하고 결정론적
let data: Map[String, List[Map[String, Int]]]
# 매 대괄호 쌍이 하나의 제네릭 스코프를 정의
# LLM이 JSON 구조를 파싱하는 것과 동일한 능력으로 처리 가능

# B의 중첩: 모호하다
let data: Map of String to List of Map of String to Int
# 파서 질문: "Map of String to Int"에서 "to Int"는 첫 번째 Map의 값인가, 두 번째 Map의 값인가?
# 해결: 괄호를 도입
let data: Map of String to (List of (Map of String to Int))
# 그런데 이러면 결국 괄호가 필요하고, of의 "자연어" 장점이 사라진다
```

이 문제는 근본적이다. `of` 키워드는 **이항 연산자**처럼 동작하는데, 연산자 우선순위가 없다. 중첩이 2단계 이상이면 반드시 괄호 또는 추가 구분자가 필요하고, 그 순간 `of`의 존재 이유(자연어 가독성)가 크게 퇴색한다.

물론 "내장 컬렉션만 허용"이므로 3단계 이상 중첩은 극히 드물다. 그러나 `Map[String, List[Int]]`는 현실적으로 빈번하며, 이 경우에도 `of`+`to` 조합이 `[]` 조합보다 복잡하다.

#### 논거 2: LLM 훈련 데이터에서 `Type[Param]` 패턴의 폭발적 증가

Python 3.9 (2020년 10월)부터 **내장 타입에 대한 대괄호 제네릭**이 도입되었다:

```python
# Python 3.9+ -- LLM 훈련 데이터에 매우 풍부
def process(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

scores: dict[str, list[int]] = {"alice": [90, 85]}
target: Optional[Enemy]  # Python의 기존 typing 모듈도 [] 사용
```

이것은 Vibe의 `List[String]`, `Map[String, Int]`와 **문법적으로 거의 동일**하다. Python은 LLM 훈련 데이터에서 가장 큰 비중을 차지하므로, 이 전이 효과는 매우 강력하다. Vibe가 `List of String`을 채택하면 이 전이 효과를 포기하는 것이다.

#### 논거 3: `of`는 키워드 예산을 소모하면서도 제한적 용도

`of`가 키워드가 되면:
- 22개 -> 23개 (게임 도메인 키워드 여유 축소)
- `of`의 용도는 **오직** `List of T`, `Map of K to V` 등 제네릭 파라미터 지정
- `in`이 "for 루프 전용"인 것과 마찬가지로, 극히 제한적 용도의 키워드
- 게다가 `Map` 타입에서는 `to`까지 필요 -- 실질적으로 키워드 2개 소모

대괄호 `[]`는 키워드를 소모하지 않고 이미 존재하는 기호를 재활용한다.

#### 논거 4: `T?` 축약이 `of` 필요성을 더 줄인다

`Option[T]`에 `T?` 축약을 사용하면 (두 문서 모두 이에 동의):

```
let target: Enemy? = find_nearest("enemy")     # T? 축약
let target: Option[Enemy] = find_nearest("enemy")  # 명시적 (필요한 경우)
```

실무에서 `Option`의 대부분은 `T?`로 작성된다. 즉 `of`가 빛을 발할 가장 빈번한 케이스(`Option of T`)가 이미 `T?`로 대체된다. 남는 것은 `List`, `Map`, `Set`, `Queue` 정도인데, 이들만을 위해 키워드를 추가하는 것은 비용 대비 효과가 낮다.

### 2.3 B (of 키워드)의 유일한 강점에 대한 반론

**"자연어 가독성"이 정말 중요한가?**

`List of String`이 `List[String]`보다 자연어에 가깝다는 것은 사실이다. 그러나:

1. **Vibe 코드를 읽는 사람은 프로그래머(또는 LLM)다.** 비프로그래머가 Vibe 코드를 읽을 가능성은 낮다.
2. **LLM은 자연어 능력과 코드 생성 능력이 분리되어 있다.** `List[String]`은 "코드 모드"에서 처리되고, `List of String`은 "자연어/코드 혼합 모드"에서 처리된다. 후자가 반드시 정확도가 높다는 보장이 없다 -- 오히려 코드와 자연어의 경계가 흐려져 파싱 오류가 증가할 수 있다.
3. **Vibe의 다른 문법은 이미 "프로그래밍 관례"를 따른다:** `fn`, `let mut`, `struct`, `enum`, `impl`, `trait` 등은 자연어가 아니라 프로그래밍 축약어다. `of`만 자연어를 추구하면 오히려 불일관적이다.

---

## 3. "제네릭 문법이 아예 필요 없는" 대안 검토

### 3.1 구체 타입명 방식: `StringList`, `StringIntMap`

```
let items: StringList = ["sword", "shield"]
let stats: StringIntMap = {"hp": 100}
```

**확장성 치명적.** Vibe가 지원하는 타입이 `Int`, `f32`, `String`, `Bool`, `Vec2` 등 10개만 있어도:
- `List` 변형: 10개 (`IntList`, `StringList`, ...)
- `Map` 변형: 100개 (`StringIntMap`, `IntStringMap`, ...)
- 사용자 정의 struct가 추가될 때마다: 무한 확장

**결론: 불가능. 제네릭 문법은 반드시 필요하다.**

### 3.2 타입 추론으로 제네릭 생략

```
# 리터럴에서 타입 추론
let items = ["sword", "shield"]        # 컴파일러가 List[String]으로 추론
let stats = {"hp": 100, "mp": 50}      # 컴파일러가 Map[String, Int]로 추론
let target = find_nearest("enemy")     # 반환 타입에서 추론

# 명시적 타입이 필요한 곳만 제네릭 표기
let empty: List[String] = []           # 빈 리터럴은 추론 불가
fn find_nearest(tag: String) -> Option[Enemy]  # 함수 시그니처에는 필수
```

**이것은 보완 전략이지 대체 전략이 아니다.** Vibe가 타입 추론을 지원한다면, 제네릭 문법의 사용 빈도가 줄어들지만, 빈 컬렉션 선언, 함수 시그니처, 구조체 필드 등에서는 여전히 명시적 표기가 필요하다.

`core-keywords.md`에서 "타입은 항상 필수"라고 결정했으므로, 타입 추론이 허용되더라도 제네릭 문법은 필수적이다.

---

## 4. `T?` 축약과의 관계

`Option[T]`에 `T?` 축약을 사용하면:

```
# 축약 형태 (권장)
let target: Enemy? = find_nearest("enemy")
let health: i32? = get_config("max_hp")

# 명시적 형태 (match 패턴 등에서 사용)
fn find_nearest(tag: String) -> Option[Enemy]
    # ...
    return Some(enemy)
    # ...
    return none

match result
    Some(value)
        use(value)
    none
        fallback()
```

**`T?`가 존재해도 `Option[T]` 표기는 유지해야 하는 이유:**

1. 함수 시그니처에서 `-> Enemy?`와 `-> Option[Enemy]` 중 어느 것이 "공식"인지 명확해야 한다. 둘 다 허용하되, `T?`를 권장 형태로 지정하면 된다.
2. `match` 패턴에서 `Some(value)`을 사용하는데, 이것이 `Option`의 variant임을 이해하려면 `Option` 타입에 대한 지식이 필요하다. `Option[T]` 표기가 이 연결을 명시적으로 보여준다.
3. `core-keywords.md`에서 이미 `Option[Entity]`를 예시로 사용하고 있다.

**결론:** `T?`는 `Option[T]`의 편의 축약으로, 제네릭 문법 자체의 필요성을 제거하지 않는다. 다만 `Option`이 가장 빈번한 제네릭 사용처이므로, `T?` 축약이 있으면 제네릭 문법의 사용 빈도가 줄어들어 `of` 키워드 도입의 가치가 더 낮아진다.

---

## 5. 최종 결정

### 승자: 접근법 A -- 대괄호 `List[String]`

```
let items: List[String] = ["sword", "shield"]
let stats: Map[String, Int] = {"hp": 100, "mp": 50}
let target: Option[Enemy] = find_nearest("enemy")
let target2: Enemy? = find_nearest("enemy")   # Option의 축약
let unique: Set[String] = {"fire", "ice"}
let queue: Queue[Event] = Queue.new()
```

### 결정 근거 요약

| 근거 | 설명 |
|------|------|
| **파서 모호성 제로** | `:`뒤 타입 문맥에서만 제네릭으로 해석. 값 문맥의 `[]`(인덱싱)과 문법적으로 구분 |
| **Python 3.9+ 전이** | `list[int]`, `dict[str, int]` 패턴이 LLM 훈련 데이터에 풍부. 교차 전이 극대화 |
| **중첩 안전** | `Map[String, List[Int]]` -- 괄호 매칭으로 구조가 명확. JSON 파싱과 동일한 LLM 능력 활용 |
| **키워드 예산 보존** | 추가 키워드 0개. 22개 키워드 예산 유지 |
| **기존 문서 일관** | `core-keywords.md`의 모든 예시, 연산자 목록, 설계 결정과 100% 일치 |
| **`T?`와의 조화** | `Option[T]`가 `T?`로 축약 가능. 가장 빈번한 제네릭 사용처가 해소되어 문법 부담 최소화 |

### 확정 문법 규칙

```
# 규칙 1: 내장 컬렉션 타입은 대괄호로 타입 파라미터를 지정한다
List[T]           # 하나의 타입 파라미터
Map[K, V]         # 두 개의 타입 파라미터 (쉼표로 구분)
Set[T]            # 하나의 타입 파라미터
Queue[T]          # 하나의 타입 파라미터
Option[T]         # 하나의 타입 파라미터 (T? 축약 권장)

# 규칙 2: 중첩은 자연스럽게 허용된다
Map[String, List[Int]]
List[Map[String, Set[Entity]]]

# 규칙 3: Option[T]는 T?로 축약 가능 (권장)
Enemy?            # == Option[Enemy]
List[Int]?        # == Option[List[Int]]

# 규칙 4: 사용자 정의 제네릭은 허용하지 않는다
# struct Pool[T]  -- 불가!
# 사용자는 구체 타입으로만 struct를 정의한다
```

### 확정 코드 예시

```
# ===== 변수 선언 =====
let items: List[String] = ["sword", "shield", "potion"]
let stats: Map[String, i32] = {"hp": 100, "mp": 50, "str": 25}
let visited: Set[String] = {"town", "forest"}
let events: Queue[Event] = Queue.new()

# ===== 함수 시그니처 =====
fn find_nearest(tag: String, pos: Vec2) -> Entity?
    let mut nearest: Entity? = none
    let mut min_dist: f32 = 999999.0
    for entity in get_all(tag)
        let dist: f32 = distance(pos, entity.pos)
        if dist < min_dist
            min_dist = dist
            nearest = Some(entity)
    return nearest

fn get_inventory(player: Player) -> List[Item]
    return player.items

fn get_damage_table() -> Map[String, i32]
    return {"sword": 25, "bow": 15, "staff": 30}

# ===== 구조체 필드 =====
struct Inventory
    items: List[Item]
    capacity: i32

struct LevelData
    enemies: List[Enemy]
    spawn_points: Map[String, Vec2]
    collectibles: Set[String]

# ===== Option과 T? =====
let target: Enemy? = find_nearest("enemy", player.pos)

match target
    Some(enemy)
        attack(enemy)
    none
        patrol()

# ===== 중첩 =====
let grouped_items: Map[String, List[Item]] = {
    "weapons": [sword, bow],
    "potions": [heal_potion, mana_potion]
}

# ===== 게임 도메인 (entity 내부) =====
entity Player
    has Sprite("hero.png")
    has Body(dynamic)

    inventory: List[Item] = []
    buffs: Map[String, f32] = {}

    signal item_collected(item: Item)

    fn add_item(item: Item)
        self.inventory.push(item)
        self.item_collected.emit(item)

    on collide(other: Entity, col: Collision)
        if other is Coin
            self.add_item(other.to_item())
            destroy(other)
```

---

## 6. BNF 문법 규칙 추가

기존 `LLM_CODE_GENERATION_ANALYSIS.md`의 BNF에서 타입 규칙을 다음과 같이 변경한다:

```ebnf
# 기존 (of 키워드 기반)
# type = NAME ("of" type ("to" type)?)? ;

# 변경 (대괄호 기반)
type           = base_type ("?")? ;
base_type      = NAME ("[" type_args "]")? ;
type_args      = type ("," type)* ;
```

이 규칙은:
- `String` -- 단순 타입
- `List[Int]` -- 단일 파라미터 제네릭
- `Map[String, Int]` -- 복수 파라미터 제네릭
- `Map[String, List[Int]]` -- 중첩 제네릭
- `Enemy?` -- Optional 축약
- `List[Int]?` -- Optional + 제네릭 조합

을 모두 파싱할 수 있다. 규칙 수: **3개 추가** (기존 `of` 방식도 유사한 규칙 수가 필요했으므로 차이 없음).

---

## 7. 다른 에이전트 문서와의 정합성 정리

### `type-system-keywords.md`와의 차이

| 항목 | `type-system-keywords.md` | 본 문서 (확정) |
|------|--------------------------|----------------|
| 제네릭 문법 | `List of Item` | `List[Item]` |
| `of` 키워드 | 포함 (10개 중 1개) | **불포함** |
| `to` 키워드 | 소프트 키워드 | **불필요** |
| 중첩 표기 | `Map of String to List of Entity` | `Map[String, List[Entity]]` |

`type-system-keywords.md`의 `of` 관련 결정은 **본 문서에 의해 대체**된다. 해당 문서의 나머지 결정(Option에 `T?` 축약, `some`/`none` 사용 등)은 본 문서와 호환된다.

### `core-keywords.md`와의 정합성

**100% 일치.** `core-keywords.md`의 모든 코드 예시(`List[Item]`, `List[Enemy]`, `Option[Entity]`)와 연산자 목록(`<>` 제거, `[]` 사용)이 본 문서의 결정과 동일하다.

### `game-domain-keywords.md`의 `has`와의 관계

`has`는 게임 도메인에서 컴포넌트 부착 용도로 사용된다:
```
entity Player
    has Sprite("hero.png")    # 컴포넌트 부착 (게임 도메인)
    items: List[Item] = []    # 제네릭 타입 필드 (언어 수준)
```

`has`와 `[]` 제네릭은 역할이 완전히 다르므로 충돌이 없다. `of` 키워드를 사용했다면 `has`와 비슷한 "키워드 + 타입" 패턴이 두 가지 존재하여 혼동 가능성이 있었지만, `[]`를 사용하면 이 문제가 사라진다.
