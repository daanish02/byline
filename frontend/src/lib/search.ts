import { config } from "@/lib/config";

export type Article = {
  title: string;
  url: string;
  date: string | null;
  snippet: string;
};

export type SearchResult = {
  articles: Article[];
  lowConfidence: boolean;
  articleCount: number;
};

type SerperOrganicItem = {
  title?: string;
  link?: string;
  date?: string;
  snippet?: string;
};

export async function findArticles(journalist: string, outlet: string): Promise<SearchResult> {
  const query = `"${journalist}" "${outlet}"`;

  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": config.serper.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 10 }),
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status}`);
  }

  const data = (await response.json()) as { organic?: SerperOrganicItem[] };
  const organic = data.organic ?? [];

  const articles: Article[] = organic.map((item) => ({
    title: item.title ?? "",
    url: item.link ?? "",
    date: item.date ?? null,
    snippet: item.snippet ?? "",
  }));

  const articleCount = articles.length;

  return {
    articles,
    articleCount,
    lowConfidence: articleCount < config.lowConfidenceThreshold,
  };
}
