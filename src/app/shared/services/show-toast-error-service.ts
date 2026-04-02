import {ApiError} from "../../core/models/ApiError";
import {MessageService} from "primeng/api";

export class ShowToastErrorService {

    static showToastError(title: string, error: Partial<ApiError> | null, messageService: MessageService) {
        if (error && error.validationErrors && error.validationErrors.length > 0) {
            error.validationErrors.forEach(e => {
                messageService.add({
                    life: 5000,
                    severity: 'error',
                    summary: `${error.message} - ${e.field}`,
                    detail: e.message
                })
            });
        } else if (error && error.message) {
            messageService.add({
                life: 5000,
                severity: 'error',
                summary: title,
                detail: `${error?.message}`
            })
        }
    }
}
