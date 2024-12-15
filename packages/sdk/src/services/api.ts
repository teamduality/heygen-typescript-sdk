import { BASE_URL } from "../config/endpoints.js";
import { httpClient } from "../utils/httpClient.js";

export async function apiRequest(
  apiKey: string,
  endpoint: string,
  data: Record<string, any>
): Promise<any> {
  if (!apiKey) {
    throw new Error("API key is required for requests.");
  }
  return httpClient(`${BASE_URL}${endpoint}`, "POST", { ...data, apiKey });
}
