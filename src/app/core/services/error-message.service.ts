import { Injectable } from '@angular/core';
import { parseApiError } from '../utils/parse-api-error';

@Injectable({ providedIn: 'root' })
export class ErrorMessageService {

    private readonly errorCodeMessages: Record<string, string> = {
        INVALID_CREDENTIALS: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.',
        ACCOUNT_LOCKED: 'Sua conta foi bloqueada. Entre em contato com o administrador.',
        ACCOUNT_DISABLED: 'Sua conta está desabilitada. Entre em contato com o administrador.',
        ACCOUNT_EXPIRED: 'Sua conta expirou. Entre em contato com o administrador.',
        TOO_MANY_ATTEMPTS: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
        INVALID_EMAIL_FORMAT: 'Formato de email inválido. Verifique o email digitado.',
        MISSING_CREDENTIALS: 'Email e senha são obrigatórios.',
        NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
        SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
        MAINTENANCE_MODE: 'Sistema em manutenção. Tente novamente mais tarde.',
        SESSION_EXPIRED: 'Sua sessão expirou. Faça login novamente.',
        UNAUTHORIZED: 'Acesso não autorizado. Verifique suas credenciais.',
        FORBIDDEN: 'Acesso negado. Você não tem permissão para acessar este recurso.',
        UNKNOWN_ERROR: 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o administrador.',
        VALIDATION_ERROR: 'Dados inválidos. Verifique as informações fornecidas.',
        RATE_LIMIT_EXCEEDED: 'Muitas tentativas. Aguarde um momento antes de tentar novamente.',
        SERVICE_UNAVAILABLE: 'Serviço temporariamente indisponível. Tente novamente mais tarde.',
    };

    private readonly statusMessages: Record<number, string> = {
        400: 'Dados inválidos. Verifique as informações fornecidas.',
        401: 'Credenciais inválidas. Verifique seu email e senha.',
        403: 'Acesso negado. Você não tem permissão para acessar este recurso.',
        404: 'Serviço não encontrado. Tente novamente mais tarde.',
        408: 'Tempo limite excedido. Tente novamente.',
        429: 'Muitas tentativas. Aguarde um momento antes de tentar novamente.',
        500: 'Erro interno do servidor. Tente novamente mais tarde.',
        502: 'Serviço temporariamente indisponível. Tente novamente mais tarde.',
        503: 'Serviço em manutenção. Tente novamente mais tarde.',
        504: 'Tempo limite do servidor. Tente novamente.',
    };

    getErrorMessage(err: unknown): string {
        const apiError = parseApiError(err);
        if (!apiError) {
            return 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o administrador.';
        }

        if (apiError.errorCode && this.errorCodeMessages[apiError.errorCode]) {
            return this.errorCodeMessages[apiError.errorCode];
        }

        if (apiError.status && this.statusMessages[apiError.status]) {
            return this.statusMessages[apiError.status];
        }

        // Prefer the user-facing Portuguese label over the developer message
        return apiError.error || apiError.message
            || 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o administrador.';
    }

    getErrorSeverity(err: unknown): 'error' | 'warning' | 'info' {
        const apiError = parseApiError(err);
        if (!apiError) return 'error';

        const { status, errorCode } = apiError;

        if (status === 401 || errorCode === 'INVALID_CREDENTIALS') return 'error';
        if (status === 403 || errorCode === 'FORBIDDEN') return 'warning';
        if (status >= 500) return 'error';
        if (status === 429 || errorCode === 'TOO_MANY_ATTEMPTS') return 'warning';

        return 'error';
    }

    shouldShowRetry(err: unknown): boolean {
        const apiError = parseApiError(err);
        if (!apiError) return false;

        const { status, errorCode } = apiError;
        return status >= 500 || status === 408 || status === 504
            || status === 429 || errorCode === 'TOO_MANY_ATTEMPTS';
    }

    getRetryDelay(err: unknown): number {
        const apiError = parseApiError(err);
        if (!apiError) return 0;

        if (apiError.status === 429 || apiError.errorCode === 'TOO_MANY_ATTEMPTS') return 60;
        if (apiError.status >= 500) return 30;

        return 0;
    }
}
