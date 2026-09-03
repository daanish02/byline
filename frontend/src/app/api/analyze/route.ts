import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/features/analysis/schema";
import { findArticles } from "@/lib/search";
import { runAnalysis } from "@/lib/llm";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AnalyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "journalist, outlet, and pitch are required" },
      { status: 400 }
    );
  }

  const { journalist, outlet, pitch } = parsed.data;

  try {
    const { articles, lowConfidence, articleCount } = await findArticles(journalist, outlet);
    const llmResult = await runAnalysis(articles, pitch);

    return NextResponse.json({
      ...llmResult,
      lowConfidence,
      articleCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/analyze]", message);

    if (message.startsWith("Serper API error")) {
      return NextResponse.json({ error: "Article search failed" }, { status: 500 });
    }
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
