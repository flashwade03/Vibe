# Vibe 프로젝트 방향성 분석 리포트

**작성일**: 2026-03-10
**벤치마크 기준**: 20 tasks × 3 languages × 3 LLMs (Claude/Gemini/OpenAI)

## 1. 현재 벤치마크 결과

| Language | Claude | Gemini | OpenAI | 평균 |
|----------|--------|--------|--------|------|
| **Vibe** | **100% (20/20)** | **100% (20/20)** | **100% (20/20)** | **100%** |
| Python-Pygame | N/A | 75% (15/20) | 95% (19/20) | 85% |
| Lua-LÖVE | N/A | 100% (20/20) | 100% (20/20) | 100% |

### 핵심 발견

- **학습 데이터 0인 언어가 Python(수십억 토큰 학습)을 넘어섬**
- Hard task에서 Python-Pygame-Gemini는 45%로 추락하지만 Vibe는 100% 유지
- **복잡도가 올라갈수록 Vibe의 우위가 커짐**

### 토큰 효율성

| Language | 평균 토큰 | Python 대비 |
|----------|----------|------------|
| **Vibe** | 144.5 | **-19.3%** |
| Lua-LÖVE | 165 | -4.4% |
| Python-Pygame | 172.5 | baseline |

## 2. 4-Layer Defense 효과 분석

| Layer | 구현 상태 | 효과 |
|-------|----------|------|
| Layer 0: 언어 설계 | 완료 | `while` alias, `+=` 지원 → GPT-4o 90%→100% |
| Layer 1: 프롬프트 | 완료 | DO NOT 섹션 + 5개 완전한 예제 |
| Layer 2: 전처리기 | 완료 | 마크다운 펜스 제거, 탭→스페이스 |
| Layer 3: Error-Feedback Loop | 완료 | Gemini 5개 hard task 복구 (없으면 75%) |

**Retry Loop 없이 Gemini Vibe**: 75% → **Retry Loop 덕분에 100%**

## 3. "Training Data Gravity" 이론

LLM 오류의 핵심 메커니즘: 300B 토큰에서 학습한 패턴을 170토큰 프롬프트로 override할 수 없다.

| 충돌 패턴 | 학습 데이터 빈도 | Override 비용 | 실제 결과 |
|----------|----------------|-------------|----------|
| `while` 대신 `for` | ~85% 언어 사용 | 매우 높음 | alias로 해결 |
| `+=` 미지원 | ~90% 언어 사용 | 높음 | 지원 추가로 해결 |
| 초기값 없는 선언 | C/Java/Go 허용 | 높음 | 피드백 루프로 해결 |
| `fn` vs `def` | ~50% 언어 사용 | 낮음 | 오류 0건 |
| `and`/`or`/`not` | Python에서 사용 | 낮음 | 오류 0건 |

**결론**: Vibe는 충돌 자체를 제거하는 전략. 충돌 비용이 높은 패턴은 수용(alias/지원), 낮은 패턴은 프롬프트로 교정.

## 4. 5대 설계 원칙 검증

| 원칙 | 근거 강도 | 비고 |
|------|----------|------|
| 명확 분리 (Clear Separation) | **강함** | `fn` vs `def` 성공, `while` vs `for` 실패가 증명 |
| 예제 주도 학습 (Example-Driven) | 중간 | Claude에서 확실. 약한 모델은 예제 무시 가능 |
| 부정적 제약 우선 (Negative First) | 약함 | "DO NOT use while"도 무시됨. 증거 부족 |
| 토큰 예산 (Token Budget) | 중간 | 합리적이나 표준 정보이론 수준 |
| 밀러-LLM 법칙 (Max 12 Rules) | 중간 | 현재 10개 규칙. 안전 범위. 반증 어려움 |

## 5. 기술 아키텍처 평가

### 강점
- Lexer→Parser→CodeGen 파이프라인 잘 분리됨
- 20 키워드, <12 "새 규칙" — Miller-LLM Law 준수
- LÖVE 2D 런타임 선택 적절 (v0~v1)

### Gap: v0 → 실제 게임 개발

| 기능 | 상태 | 위험도 |
|------|------|--------|
| fn, let, if, for | 구현 완료 | 낮음 |
| struct + methods | **미구현** | **높음** |
| enum + match | **미구현** | **높음** |
| trait + has | **미구현** | **높음** |
| Type Checker | 없음 | 중간 |
| Module System | 없음 | 중간 |

### 정확도 예측 (기능 추가 시)

| 버전 | 추가 기능 | Claude 예상 | GPT-4o 예상 | Gemini 예상 |
|------|----------|------------|------------|------------|
| v0 (현재) | fn, let, if, for | 100% | 100% | 100% |
| v0.5 | + struct, methods | 98% | 85% | 70% |
| v1 | + enum, match, trait | 95% | 75% | 50% |
| v1.5 | + annotations, modules | 90% | 60% | 30% |

## 6. 경쟁 우위 분석

### Vibe는 새 카테고리: LLM-native Language

기존 언어와 직접 경쟁이 아님. "snake clone 만들어줘" → 5초 안에 실행 가능한 게임.

| 경쟁자 | LLM 최적화 | 채택 용이성 | 생태계 |
|--------|----------|-----------|--------|
| **Vibe** | **100/100** | 30/100 | 10/100 |
| Python+Pygame | 40/100 | 95/100 | 95/100 |
| GDScript+Godot | 70/100 | 50/100 | 60/100 |
| Lua+LÖVE | 35/100 | 60/100 | 50/100 |

### 시장 타이밍

- 모델이 좋아질수록 Vibe 우위 확대 (Python은 학습 포화, Vibe는 개선 여지 큼)
- 2025-2027: 모델 이질성이 높은 시기 → Vibe의 설계 우위 가장 큼
- 확장 가능: 게임 → 로보틱스, IoT, 금융 알고리즘

### 위험 요인

1. **통계적 신뢰도**: 20 task 작음 (95% CI: 88-100%). 50+ task 필요
2. **Semantic correctness 미측정**: 파싱 성공 ≠ 게임 정확히 동작
3. **커뮤니티 부트스트래핑**: 채택 → 학습 데이터 → 정확도 선순환 필요
4. **범위 확대 시 정확도 하락**: struct/enum/trait 추가 시 검증 필요

## 7. 다음 단계 (합의)

### 즉시 (1-2주)
1. **벤치마크 50+ task 확장** — 통계적 신뢰도 + 난이도 균형
2. **Semantic correctness 측정** 추가

### 중기 (1-2개월)
3. **Struct/Enum/Trait 구현** (v0.5) — 실제 게임 개발 가능하게
4. **v0.5 기능으로 벤치마크 재실행** — 정확도 하락 여부 확인

### 장기 (3-6개월)
5. **연구 논문**: "Training Data Gravity in LLM Code Generation"
6. **itch.io/game jam 파트너십**
7. **A/B 비교 연구** (Vibe vs Python+transpiler, 프롬프트 통제)
