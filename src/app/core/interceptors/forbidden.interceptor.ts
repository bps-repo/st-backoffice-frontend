import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {inject} from "@angular/core";
import {MessageService} from "primeng/api";

export const forbiddenInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService)
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 403) {
                messageService.add({
                    severity: 'error',
                    summary: 'Permissão Negada!',
                    detail: 'Você não é permitido acessar este recurso.'
                });
            }
            return throwError(() => error)
        })
    )
};
