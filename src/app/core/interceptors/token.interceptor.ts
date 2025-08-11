import {HttpInterceptorFn, HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {catchError, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {authActions} from '../store/auth/actions/auth.actions';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
    const store = inject(Store);
    const router = inject(Router);
    const messageService = inject(MessageService);

    const excludedUrls = ['/login', '/refresh-token'];

    if (excludedUrls.some((url) => request.url.includes(url))) {
        return next(request);
    }

    const token = localStorage.getItem('accessToken');

    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refreshToken');

                if (refreshToken) {
                    store.dispatch(authActions.refreshToken({refreshToken}));

                    // If we're here, we've already tried to refresh the token
                    // but still got an error, so we should log out
                    if (request.url.includes('/refresh-token')) {
                        messageService.add({
                            severity: 'error',
                            summary: 'Acesso negado',
                            detail: 'Sua sessão expirou. Por favor, faça login novamente.',
                            life: 5000
                        });

                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        router.navigate(['/auth/login']).then();
                    }
                } else {
                    // No refresh token available
                    messageService.add({
                        severity: 'error',
                        summary: 'Acesso negado',
                        detail: 'Sua sessão expirou. Por favor, faça login novamente.',
                        life: 5000
                    });

                    localStorage.removeItem('accessToken');
                    router.navigate(['/auth/login']).then();
                }
            }

            return throwError(() => error);
        })
    );
};
