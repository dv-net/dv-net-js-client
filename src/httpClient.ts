import axios, {
    type AxiosHeaders,
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type Method,
} from 'axios';
import { HttpClient } from './types.js';

export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;
  constructor(options: {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
  } = {}) {
    this.axiosInstance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
  }
  async request<T = any>(config: {
    method: Method | string;
    url: string;
    data?: any;
    headers?: AxiosHeaders;
  }): Promise<{
    data: T;
    status: number;
    statusText: string;
  }> {
    const axiosConfig: AxiosRequestConfig = {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    };
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request(axiosConfig);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error: any) {
      if (error && error.response) {
        const statusCode = error.response.status;
        const responseData = error.response.data;
        if (responseData && typeof responseData === 'object') {
          throw responseData;
        }
        if (typeof responseData === 'string') {
          try {
            const parsed = JSON.parse(responseData);
            throw parsed;
          } catch (_e) {
          }
        }
        throw {
          errors: [{ message: error.response.statusText || 'Request failed' }],
          code: statusCode,
        };
      }
      if (error && error.request) {
        throw {
          errors: [{ message: 'Network error' }],
          code: 500,
        };
      }
      throw {
        errors: [{ message: error?.message || 'Request error' }],
        code: 500,
      };
    }
  }
}

export class SimpleHttpClient implements HttpClient {
  async request<T = any>(config: {
    method: string;
    url: string;
    data?: any;
    headers?: Record<string, string>;
  }): Promise<{
    data: T;
    status: number;
    statusText: string;
  }> {
    const fetchConfig: RequestInit = {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...config.headers,
      },
    };
    if (config.data) {
      fetchConfig.body = JSON.stringify(config.data);
    }
    try {
      const response = await fetch(config.url, fetchConfig);
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const parsed = JSON.parse(errorText);
          throw parsed;
        } catch (_e) {
          throw {
            errors: [{ message: response.statusText || 'Request failed' }],
            code: response.status,
          };
        }
      }
      const data = await response.json();
      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error: any) {
      if (error && error.errors && typeof error.code !== 'undefined') {
        throw error;
      }
      throw {
        errors: [{ message: error?.message || 'Network error' }],
        code: 0,
      };
    }
  }
}
