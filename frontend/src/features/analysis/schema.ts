import { z } from "zod";

export const AnalyzeRequestSchema = z.object({
  journalist: z.string().min(1).max(200),
  outlet: z.string().min(1).max(200),
  pitch: z.string().min(1).max(10000),
});

export const AnalyzeResponseSchema = z.object({
  profile: z.string(),
  score: z.number().int().min(0).max(100),
  scoreReasoning: z.string(),
  rewrite: z.string(),
  openingLine: z.string().nullable(),
  lowConfidence: z.boolean(),
  articleCount: z.number().int().min(0),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
