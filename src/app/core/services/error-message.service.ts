import { Injectable } from '@angular/core';

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errorCode: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  private errorMessages: { [key: string]: string } = {
    'INVALID_CREDENTIALS': 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.',
    'ACCOUNT_LOCKED': 'Sua conta foi bloqueada. Entre em contato com o administrador.',
    'ACCOUNT_DISABLED': 'Sua conta está desabilitada. Entre em contato com o administrador.',
    'ACCOUNT_EXPIRED': 'Sua conta expirou. Entre em contato com o administrador.',
    'TOO_MANY_ATTEMPTS': 'Muitas tentativas de login. Tente novamente em alguns minutos.',
    'INVALID_EMAIL_FORMAT': 'Formato de email inválido. Verifique o email digitado.',
    'MISSING_CREDENTIALS': 'Email e senha são obrigatórios.',
    'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet e tente novamente.',
    'SERVER_ERROR': 'Erro interno do servidor. Tente novamente mais tarde.',
    'MAINTENANCE_MODE': 'Sistema em manutenção. Tente novamente mais tarde.',
    'SESSION_EXPIRED': 'Sua sessão expirou. Faça login novamente.',
    'UNAUTHORIZED': 'Acesso não autorizado. Verifique suas credenciais.',
    'FORBIDDEN': 'Acesso negado. Você não tem permissão para acessar este recurso.',
    'UNKNOWN_ERROR': 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o administrador.',
    'VALIDATION_ERROR': 'Dados inválidos. Verifique as informações fornecidas.',
    'RATE_LIMIT_EXCEEDED': 'Muitas tentativas. Aguarde um momento antes de tentar novamente.',
    'SERVICE_UNAVAILABLE': 'Serviço temporariamente indisponível. Tente novamente mais tarde.'
  };

  private statusCodeMessages: { [key: number]: string } = {
    400: 'Dados inválidos. Verifique as informações fornecidas.',
    401: 'Credenciais inválidas. Verifique seu email e senha.',
    403: 'Acesso negado. Você não tem permissão para acessar este recurso.',
    404: 'Serviço não encontrado. Tente novamente mais tarde.',
    408: 'Tempo limite excedido. Tente novamente.',
    429: 'Muitas tentativas. Aguarde um momento antes de tentar novamente.',
    500: 'Erro interno do servidor. Tente novamente mais tarde.',
    502: 'Serviço temporariamente indisponível. Tente novamente mais tarde.',
    503: 'Serviço em manutenção. Tente novamente mais tarde.',
    504: 'Tempo limite do servidor. Tente novamente.'
  };

  /**
   * Get user-friendly error message based on API error response
   */
  getErrorMessage(error: any): string {
    // If it's a structured API error
    if (error && typeof error === 'object') {
      // Check for specific error code first
      if (error.errorCode && this.errorMessages[error.errorCode]) {
        return this.errorMessages[error.errorCode];
      }

      // Check for specific message
      if (error.message && this.errorMessages[error.message]) {
        return this.errorMessages[error.message];
      }

      // Check for status code
      if (error.status && this.statusCodeMessages[error.status]) {
        return this.statusCodeMessages[error.status];
      }

      // Use the API message if available
      if (error.message) {
        return error.message;
      }
    }

    // If it's just a status code
    if (typeof error === 'number' && this.statusCodeMessages[error]) {
      return this.statusCodeMessages[error];
    }

    // Default fallback message
    return 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o administrador.';
  }

  /**
   * Get error severity level for styling purposes
   */
  getErrorSeverity(error: any): 'error' | 'warning' | 'info' {
    if (error && typeof error === 'object') {
      const status = error.status || error.errorCode;

      if (status === 401 || status === 'INVALID_CREDENTIALS') {
        return 'error';
      }

      if (status === 403 || status === 'FORBIDDEN') {
        return 'warning';
      }

      if (status >= 500) {
        return 'error';
      }

      if (status === 429 || status === 'TOO_MANY_ATTEMPTS') {
        return 'warning';
      }
    }

    return 'error';
  }

  /**
   * Check if error should show retry option
   */
  shouldShowRetry(error: any): boolean {
    if (error && typeof error === 'object') {
      const status = error.status;
      const errorCode = error.errorCode;

      // Show retry for network/server errors
      if (status >= 500 || status === 408 || status === 504) {
        return true;
      }

      // Show retry for rate limiting
      if (status === 429 || errorCode === 'TOO_MANY_ATTEMPTS') {
        return true;
      }
    }

    return false;
  }

  /**
   * Get retry delay in seconds
   */
  getRetryDelay(error: any): number {
    if (error && typeof error === 'object') {
      const status = error.status;
      const errorCode = error.errorCode;

      if (status === 429 || errorCode === 'TOO_MANY_ATTEMPTS') {
        return 60; // 1 minute
      }

      if (status >= 500) {
        return 30; // 30 seconds
      }
    }

    return 0;
  }
}
