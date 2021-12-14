
// Copy from https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions#edge-functions-with-streaming

import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
  // @ts-ignore
} from "eventsource-parser";
import server from "../config-server";

export async function OpenAIStream(payload: object) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  let url = new URL(server.openAIAPIBaseURL);
  url.pathname = "/v1/chat/completions";

  const res = await fetch(url.href, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${server.openAIAPIKey}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }