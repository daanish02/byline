import { config } from "@/lib/config";
import type { Article } from "@/lib/search";

export type LLMResult = {
  profile: string;
  score: number;
  scoreReasoning: string;
  rewrite: string;
  openingLine: string | null;
};

async function chat(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openrouter.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://byline.app",
      "X-Title": "Byline",
    },
    body: JSON.stringify({
      model: config.openrouter.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter error: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };

  return data.choices[0]?.message?.content ?? "";
}

function articleSummary(articles: Article[]): string {
  return articles
    .map((a, i) => `${i + 1}. "${a.title}" — ${a.url}${a.date ? ` (${a.date})` : ""}`)
    .join("\n");
}

export async function runAnalysis(articles: Article[], pitch: string): Promise<LLMResult> {
  const articleList = articleSummary(articles);

  // Batch 1 — profile and opening line are independent: run in parallel
  const [profile, openingLine] = await Promise.all([
    chat(
      "You are a media analyst. Given a list of articles by a journalist, write a concise 2-3 sentence coverage profile describing their beat, recurring angles, and what they care most about. Be specific, not generic.",
      articles.length > 0
        ? `Articles:\n${articleList}`
        : "No articles were found for this journalist. Write a brief note that their coverage could not be profiled due to insufficient data."
    ),
    // Opening line only when articles exist (hallucination guard)
    articles.length > 0
      ? chat(
          "You are a PR writer. Write one opening sentence for an email to this journalist. It must reference a specific article from the list provided — cite the title naturally. Return only the sentence, no preamble.",
          `Recent articles by this journalist:\n${articleList}`
        )
      : Promise.resolve(null),
  ]);

  // Batch 2 — score and rewrite both need profile: run in parallel after batch 1
  const [scoreResponse, rewrite] = await Promise.all([
    chat(
      `You are a PR strategist. Rate how well a pitch fits a journalist's coverage on a scale of 0-100. Reply with exactly this format:\nSCORE: <number>\nREASONING: <1-2 sentences explaining the score, referencing specific angles>`,
      `Journalist profile:\n${profile}\n\nPitch:\n${pitch}`
    ),
    chat(
      "You are a PR writer. Rewrite the pitch to match the journalist's specific beat and angle. Keep the core story but shift the framing to speak their language. Return only the rewritten pitch, no preamble.",
      `Journalist profile:\n${profile}\n\nOriginal pitch:\n${pitch}`
    ),
  ]);

  const scoreMatch = scoreResponse.match(/SCORE:\s*(\d+)/i);
  const reasoningMatch = scoreResponse.match(/REASONING:\s*([\s\S]+)/i);
  const score = Math.min(100, Math.max(0, Number(scoreMatch?.[1] ?? "50")));
  const scoreReasoning = reasoningMatch?.[1]?.trim() ?? scoreResponse.trim();

  return { profile, score, scoreReasoning, rewrite, openingLine };
}
