import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../models/ApiError';

/**
 * Normalizes any thrown value into a typed ApiError.
 *
 * Handles three shapes:
 *  1. HttpErrorResponse — Angular wraps the backend body in `.error`
 *  2. Plain ApiError body — already parsed (e.g. stored in NgRx state)
 *  3. string — bare error message
 */
export function parseApiError(err: unknown): ApiError | null {
    if (!err) return null;

    if (err instanceof HttpErrorResponse) {
        const body = err.error;
        if (body && typeof body === 'object' && 'errorCode' in body) {
            return body as ApiError;
        }
        // Non-JSON or unexpected body — synthesize from HTTP metadata
        return {
            timestamp: new Date().toISOString(),
            status: err.status,
            error: err.statusText || 'Erro',
            message: err.message,
            errorCode: String(err.status),
            path: err.url ?? '',
        };
    }

    if (typeof err === 'object' && err !== null) {
        const obj = err as Record<string, unknown>;

        // Raw API error body (e.g. from NgRx store after effects re-throw)
        if ('errorCode' in obj) {
            return obj as unknown as ApiError;
        }

        // HttpErrorResponse-like plain object (edge case: already serialized)
        if ('error' in obj && typeof obj['error'] === 'object' && obj['error'] !== null) {
            const nested = obj['error'] as Record<string, unknown>;
            if ('errorCode' in nested) {
                return nested as unknown as ApiError;
            }
        }
    }

    if (typeof err === 'string') {
        return {
            timestamp: new Date().toISOString(),
            status: 0,
            error: err,
            message: err,
            errorCode: 'UNKNOWN_ERROR',
            path: '',
        };
    }

    return null;
}

export function extractApiErrorMessage(err: unknown): string {
    const apiError = parseApiError(err);
    if (!apiError) return 'Ocorreu um erro inesperado.';

    if (apiError.validationErrors?.length) {
        return apiError.validationErrors.map((e) => e.message).join(', ');
    }

    return apiError.error || apiError.message || 'Ocorreu um erro inesperado.';
}
