const client = {
  appName: fillDefault(process.env.appName, "OhMyGPT"),
  appLogo: process.env.appLogo ?? undefined,
  appThemeColor: fi