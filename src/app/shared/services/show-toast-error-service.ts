import { ApiError } from "../../core/models/ApiError";
import { MessageService } from "primeng/api";

export class ShowToastErrorService {

    static showToastError(
        title: string,
        error: Partial<ApiError> | string | null | undefined,
        messageService: MessageService,
        fallbackMessage?: string
    ): void {
        const normalizedError = this.normalizeError(error);

        if (normalizedError?.validationErrors?.length) {
            const summaryBase = normalizedError.message || title;
            normalizedError.validationErrors.forEach(e => {
                messageService.add({
                    life: 5000,
                    severity: 'error',
                    summary: `${summaryBase}${e.field ? ` - ${e.field}` : ''}`,
                    detail: e.message
                });
            });
            return;
        }

        const rawMessage = normalizedError?.message || fallbackMessage;
        if (!rawMessage) return;

        rawMessage
            .split('|')
            .map((message) => message.trim())
            .filter(Boolean)
            .forEach((message) => {
                messageService.add({
                    life: 5000,
                    severity: 'error',
                    summary: title,
                    detail: message
                });
            });
    }

    private static normalizeError(error: Partial<ApiError> | string | null | undefined): Partial<ApiError> | null {
        if (!error) return null;
        if (typeof error === 'string') {
            return { message: error };
        }

        const nestedError = (error as any).error;
        if (nestedError && typeof nestedError === 'object') {
            return {
                ...(error as any),
                ...(nestedError as any),
                message: (nestedError as any).message || (error as any).message,
                validationErrors: (nestedError as any).validationErrors || (error as any).validationErrors
            };
        }

        if (!(error as any).message && typeof nestedError === 'string') {
            return { ...(error as any), message: nestedError };
        }

        if (!(error as any).message && typeof (error as any).detail === 'string') {
            return { ...(error as any), message: (error as any).detail };
        }

        return error;
    }
}
