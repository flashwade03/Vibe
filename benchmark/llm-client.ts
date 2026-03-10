import { LLMProvider } from "./types.js";
import { BenchmarkConfig } from "./config.js";

/**
 * Strip markdown code fences from LLM responses.
 * Handles ```python, ```lua, ```vibe, ``` etc.
 */
function stripCodeFences(text: string): string {
  // Match opening fence with optional language tag and closing fence
  const fencePattern = /^```[a-zA-Z]*\s*\n?([\s\S]*?)\n?```\s*$/;
  const match = text.trim().match(fencePattern);
  if (match) {
    return match[1].trim();
  }
  // Also handle case where there are multiple code blocks — take the first one
  const blockMatch = text.match(/```[a-zA-Z]*\s*\n([\s\S]*?)\n```/);
  if (blockMatch) {
    return blockMatch[1].trim();
  }
  return text.trim();
}

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  config: BenchmarkConfig,
  temperature: number = 0.2,
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: 4096,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error(`Gemini returned no content: ${JSON.stringify(data)}`);
  }

  return stripCodeFences(data.candidates[0].content.parts[0].text);
}

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  config: BenchmarkConfig,
  temperature: number = 0.2,
): Promise<string> {
  const url = "https://api.openai.com/v1/chat/completions";

  // Override model to gpt-4o (codex-mini only supports /v1/responses)
  const model = config.openaiModel.includes("codex") ? "gpt-4o" : config.openaiModel;

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
    max_tokens: 4096,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error(`OpenAI returned no content: ${JSON.stringify(data)}`);
  }

  return stripCodeFences(data.choices[0].message.content);
}

export async function callLLM(
  provider: LLMProvider,
  systemPrompt: string,
  userPrompt: string,
  config: BenchmarkConfig,
  temperature: number = 0.2,
): Promise<{ code: string; latencyMs: number }> {
  const start = Date.now();
  let code: string;

  if (provider === "gemini") {
    code = await callGemini(systemPrompt, userPrompt, config, temperature);
  } else {
    code = await callOpenAI(systemPrompt, userPrompt, config, temperature);
  }

  return { code, latencyMs: Date.now() - start };
}
