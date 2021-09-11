const client = {
  appName: fillDefault(process.env.appName, "OhMyGPT"),
  appLogo: process.env.appLogo ?? undefined,
  appThemeColor: fillDefault(process.env.appThemeColor, "#22c55e"),
  appSummary: fillDefault(process.env.appSummary, "Ask me a