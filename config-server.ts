const server = {
  openAIAPIKey: required(process.env.OPENAI_API_KEY, "OPENAI_API_KEY"),
  openAIAPIBaseURL: fillDefault(
    process.env.OPENAI_API_BASE_URL,
    "https://api.open