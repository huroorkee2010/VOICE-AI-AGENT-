import axios, { AxiosInstance, AxiosError } from 'axios';
import { APIResponse } from './types';
import { CONSTANTS } from './constants';

class APIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Use relative URL for API calls (works on any port)
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = typeof window !== 'undefined' ? 
          localStorage.getItem('auth_token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Send chat message (N8N webhook)
   */
  async chat(
    message: string,
    conversationHistory?: any[],
    signal?: AbortSignal,
    language?: 'en' | 'hi'
  ): Promise<{ message: string; tokens?: number; language?: string }> {
    console.log('📤 Sending chat message:', { message, historyLength: conversationHistory?.length, language });
    
    try {
      const response = await this.client.post<
        APIResponse<{ message: string; tokens?: number; language?: string }>
      >(CONSTANTS.API.CHAT, {
        message,
        history: conversationHistory,
        language: language || 'en',
      }, {
        signal,
      });

      if (!response.data.success) {
        const errorMsg = response.data.error || 'Chat request failed';
        console.error('❌ Chat API error:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('✅ Chat response received:', response.data.data);
      return response.data.data!;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chat request failed';
      const axiosError = error as AxiosError;
      
      console.error('❌ Chat request error:', {
        error: errorMsg,
        status: axiosError?.response?.status,
        statusText: axiosError?.response?.statusText,
        responseData: axiosError?.response?.data,
        message: axiosError?.message,
        code: axiosError?.code,
      });
      
      // Provide more helpful error message
      if (axiosError?.response?.status === 503) {
        throw new Error('AI service unavailable. Check webhook URL in .env.local');
      }
      if (axiosError?.response?.data && typeof axiosError.response.data === 'object') {
        const respData = axiosError.response.data as any;
        throw new Error(respData.error || errorMsg);
      }
      throw error;
    }
  }

  /**
   * Get realtime stream
   */
  async realtimeStream(config: any): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}${CONSTANTS.API.REALTIME}`;

      try {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          ws.send(JSON.stringify(config));
          resolve(ws);
        };

        ws.onerror = (_error) => {
          reject(new Error('Failed to establish realtime connection'));
        };

        // Timeout after 10 seconds
        setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            reject(new Error('Realtime connection timeout'));
          }
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get with retry logic
   */
  async getWithRetry<T>(url: string, maxRetries = 3): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await this.client.get<T>(url);
        return response.data;
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, CONSTANTS.TIMING.RECONNECT_DELAY * (i + 1))
          );
        }
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * Post with retry logic
   */
  async postWithRetry<T>(
    url: string,
    data: any,
    maxRetries = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await this.client.post<T>(url, data);
        return response.data;
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, CONSTANTS.TIMING.RECONNECT_DELAY * (i + 1))
          );
        }
      }
    }

    throw lastError || new Error('Request failed');
  }
}

export const apiClient = new APIClient();
export default apiClient;
