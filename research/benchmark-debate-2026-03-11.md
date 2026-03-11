# Benchmark Debate Results (2026-03-11)

Agent-teams debate: optimist, skeptic, engineer — 2 rounds with cross-agent rebuttals.

## Benchmark Data

| LLM | Vibe | Python | Lua |
|-----|------|--------|-----|
| Claude | 100% (30/30) | N/A | N/A |
| Gemini | 100% (30/30) | 100% | 100% |
| OpenAI | 80% (24/30) | 100% | 100% |

Difficulty breakdown (Vibe only):
- Easy (5): Gemini 100%, OpenAI 100%
- Medium (9): Gemini 100%, OpenAI 89%
- Hard (8): Gemini 100%, OpenAI 75%
- Trap (8): Gemini 100%, OpenAI 63%

## Consensus (all 3 agreed)

### 1. "100% pass rate" is parser pass rate, not runtime verification

All PASS codes are validated only through `lex → parse → generate`. No runtime execution check. Known CodeGen bugs (`len()` unmapped, 0-indexed arrays in 1-indexed Lua, `continue` → comment) mean most PASS code would crash at runtime. results.md needs a "Parser Only" caveat.

### 2. Vibe syntax design works

Even skeptic conceded "Layer 0 contribution is acknowledged, but attribution separation is needed." Token efficiency (20% less than Python, 20-30% less than Lua) confirmed by all three as a real structural advantage.

### 3. CodeGen bug fixes + runtime validation is top priority (P0)

- `len()` → Lua `#` operator
- 0-indexed → 1-indexed array access
- `continue` → proper Lua implementation
- Without these fixes, pass rate numbers are meaningless. All three agreed.

## Unresolved Disagreements

| Issue | Optimist | Skeptic | Engineer |
|-------|----------|---------|----------|
| What Gemini 100% proves | Language design victory | Gemini is just good at instruction following | Both contribute, need ablation study |
| Cause of token efficiency | Syntax conciseness | Boilerplate removal | vs Lua = syntax design, vs Python = mixed |
| Is Vibe better than Python for LLM? | Yes (tokens + design) | No evidence (OpenAI 80% vs 100%) | Can't judge yet |

## Positions Changed Through Debate

- **Optimist**: "Error-Feedback Loop will push 90%+" → Already applied, realistic ceiling is 83-87%
- **Skeptic**: "Trap category is meaningless" → "Layer 0 contribution acknowledged, attribution separation needed"
- **Skeptic**: "Minimum 10 repeated runs" → Pragmatic compromise at 3-5 runs
- **Engineer**: Working demo priority P2 → Elevated to P0 bundled with CodeGen bug fixes

## Conclusion

> **Design validated (done) ≠ Implementation complete (todo)**

The hard problem (language design) is backed by data. What remains are relatively easier problems: CodeGen bugs, runtime validation, benchmark expansion. However, the false sense of security from "100%" is the biggest risk — all three agreed on this.

## Recommended Actions

| Priority | Action |
|----------|--------|
| P0 | CodeGen bug fixes (len→#, index+1, continue) + runtime validation pipeline + 1 working game demo |
| P1 | Add "Parser Only" caveat to results.md |
| P1 | Add struct/enum/trait benchmark tasks (6-8 tasks) |
| P2 | Run benchmarks 3-5 times, report mean ± stddev |
| P2 | Ablation study to separate language design vs model capability contributions |
