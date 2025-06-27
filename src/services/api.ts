// Cliente HTTP base con Axios
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants';
import type { ApiError } from '@/types/api';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de request
    this.instance.interceptors.request.use(
      (config) => {
        // Agregar logs en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('🚀 API Request:', `${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de response
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log exitoso en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ API Response:', response.status, response.config.url);
        }
        return response;
      },
      (error: AxiosError) => {
        const apiError = this.handleError(error);
        
        // Log de error en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ API Error:', apiError);
        }
        
        return Promise.reject(apiError);
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    // Error de timeout
    if (error.code === 'ECONNABORTED') {
      return {
        message: ERROR_MESSAGES.TIMEOUT_ERROR,
        statusCode: 0,
        details: error.message,
      };
    }

    // Error sin respuesta (problema de red)
    if (!error.response) {
      return {
        message: ERROR_MESSAGES.NETWORK_ERROR,
        statusCode: 0,
        details: error.message,
      };
    }

    // Error con respuesta del servidor
    const { status, data } = error.response;
    
    switch (status) {
      case HTTP_STATUS.NOT_FOUND:
        return {
          message: ERROR_MESSAGES.NOT_FOUND,
          statusCode: status,
          details: data,
        };
      case HTTP_STATUS.BAD_REQUEST:
        return {
          message: 'Solicitud inválida',
          statusCode: status,
          details: data,
        };
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return {
          message: 'Error interno del servidor',
          statusCode: status,
          details: data,
        };
      default:
        return {
          message: ERROR_MESSAGES.GENERIC_ERROR,
          statusCode: status,
          details: data,
        };
    }
  }

  // Métodos públicos para realizar peticiones
  public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }

  // Obtener la instancia de Axios para casos especiales
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Exportar instancia singleton
export const apiClient = new ApiClient();
export default apiClient; 