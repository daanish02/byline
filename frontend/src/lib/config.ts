function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const config = {
  openrouter: {
    apiKey: requireEnv("OPENROUTER_API_KEY"),
    model: process.env["OPENROUTER_MODEL"] ?? "deepseek/deepseek-v4-flash-0731",
  },
  serper: {
    apiKey: requireEnv("SERPER_API_KEY"),
  },
  lowConfidenceThreshold: Number(process.env["LOW_CONFIDENCE_THRESHOLD"] ?? "5"),
} as const;
