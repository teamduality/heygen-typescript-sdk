import { authenticate } from "./services/authentication.js";
import { apiRequest } from "./services/api.js";

export class HeygenSDK {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async authenticate() {
    return authenticate(this.apiKey);
  }

  async makeRequest(endpoint: string, data: Record<string, any>) {
    return apiRequest(this.apiKey, endpoint, data);
  }
}

export * from "./types/index.js";
