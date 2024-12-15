import { BASE_URL } from "../config/endpoints.js";
import { httpClient } from "../utils/httpClient.js";

export async function authenticate(apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is required for authentication.");
  }
  const response = await httpClient(`${BASE_URL}/auth`, "POST", { apiKey });
  return response.token;
}
