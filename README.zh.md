
# OhMyGPT

[English](README.md)

OhMyGPT 是一个项目，它使您能够在几分钟内部署基于 ChatGPT 的 Web 应用程序，只需配置一些环境变量即可。您会得到一个类似于 https://polisher.vercel.app 和 https://ohmyzhen.vercel.app 的 Web 应用程序。

要部署基于 ChatGPT 的 Web 应用程序，您将需要来自 [OpenAI](https://platform.openai.com/account/api-keys) 的 API 密钥和一个[Vercel](https://vercel.com)帐户。我们计划将来扩大我们的支持范围，包括更多的云平台。但是目前，它只在 Vercel 上进行了测试。

![Screenshot](screenshot.png)

## 开始

1. 将此 repo fork 到您自己的 GitHub 账户中。
2. 登录您的 [Vercel](https://vercel.com) 控制台，从 fork 的 repo 创建一个新项目。（⚠️ 注意此时不要点击 Deploy 按钮）
3. 在配置项目步骤中 [设置环境变量](#设置环境变量)。
4. 部署应用程序，并让 Vercel 完成部署过程。
5. 在您的浏览器中访问您的 Web 应用程序，并将其分享给您的朋友。🥳

## 设置环境变量

您可以使用环境变量自定义应用程序。以下是所有可用变量及其用途：

```env
＃客户端