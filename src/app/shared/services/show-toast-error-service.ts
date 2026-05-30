import { MessageService } from 'primeng/api';
import { parseApiError } from '../../core/utils/parse-api-error';

export class ShowToastErrorService {

    /**
     * Displays one or more PrimeNG error toasts from any thrown value.
     *
     * - If the API returned validationErrors, each field error is shown as its own toast.
     * - Otherwise the user-facing `error` label is shown (e.g. "Validação falhou"),
     *   falling back to `message` and then to `fallbackMessage`.
     *
     * @param title       Toast summary / heading
     * @param err         Anything caught in a catchError / try-catch block
     * @param messageService  PrimeNG MessageService instance
     * @param fallbackMessage Shown when the error carries no displayable text
     */
    static showToastError(
        title: string,
        err: unknown,
        messageService: MessageService,
        fallbackMessage?: string
    ): void {
        const apiError = parseApiError(err);

        if (apiError?.validationErrors?.length) {
            for (const ve of apiError.validationErrors) {
                const detail = ve.field ? `${ve.field}: ${ve.message}` : ve.message;
                messageService.add({ life: 5000, severity: 'error', summary: title, detail });
            }
            return;
        }

        // message = descriptive detail from the backend; error = generic HTTP status label
        const detail = apiError?.message || apiError?.error || fallbackMessage;
        if (!detail) return;

        // Support pipe-delimited multi-message strings (legacy pattern)
        detail
            .split('|')
            .map(s => s.trim())
            .filter(Boolean)
            .forEach(msg => messageService.add({ life: 5000, severity: 'error', summary: title, detail: msg }));
    }
}
