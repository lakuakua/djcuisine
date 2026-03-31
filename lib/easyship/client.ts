import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  EASYSHIP_API_BASE_URL,
  EASYSHIP_SANDBOX_API_BASE_URL,
} from '@/lib/constants/shipping';

export class EasyshipClient {
  private client: AxiosInstance;

  constructor() {
    const apiKey = process.env.EASYSHIP_API_KEY;
    if (!apiKey) {
      throw new Error('EASYSHIP_API_KEY is not set');
    }
    const cleanedApiKey = apiKey.trim();
    const isSandbox = process.env.EASYSHIP_SANDBOX_MODE === 'true';
    const baseURL = isSandbox ? EASYSHIP_SANDBOX_API_BASE_URL : EASYSHIP_API_BASE_URL;

    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${cleanedApiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error('[Easyship API]', error.response.status, error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

let singleton: EasyshipClient | null = null;

export function getEasyshipClient(): EasyshipClient | null {
  if (!process.env.EASYSHIP_API_KEY?.trim()) {
    return null;
  }
  if (!singleton) {
    singleton = new EasyshipClient();
  }
  return singleton;
}
