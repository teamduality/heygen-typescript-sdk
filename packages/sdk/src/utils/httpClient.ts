import fetch from "node-fetch";
import type { RequestInit } from "node-fetch";

export async function httpClient(
  url: string,
  method: "GET" | "POST",
  body?: Record<string, any>
): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
