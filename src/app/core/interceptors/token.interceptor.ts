import {HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent} from '@angular/common/http';
import {inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {catchError, switchMap, throwError, filter, take, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {authActions} from '../store/auth/auth.actions';
import {authFeature} from '../store/auth/auth.reducers';
import {JwtTokenService} from '../services/jwtToken.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
    const store = inject(Store);
    const router = inject(Router);
    const messageService = inject(MessageService);

    const excludedUrls = ['/login', '/refresh-token'];

    if (excludedUrls.some((url) => request.url.includes(url))) {
        return next(request);
    }

    // Check if token is expired before making the request
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token) {
        try {
            JwtTokenService.decodeToken(token);
            const isExpired = JwtTokenService.isTokenExpired();

            if (isExpired && refreshToken) {
                // Token is expired, try to refresh it
                return handleTokenRefresh(store, request, next, refreshToken, messageService, router);
            } else if (isExpired && !refreshToken) {
                // Token is expired and no refresh token, redirect to login
                handleTokenExpired(messageService, router);
                return throwError(() => new HttpErrorResponse({ status: 401 }));
            }
        } catch (error) {
            // Invalid token, clear and redirect
            handleTokenExpired(messageService, router);
            return throwError(() => new HttpErrorResponse({ status: 401 }));
        }

        // Add token to request
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                if (refreshToken && !request.url.includes('/refresh-token')) {
                    // Try to refresh the token
                    return handleTokenRefresh(store, request, next, refreshToken, messageService, router);
                } else {
                    // No refresh token or refresh token request failed
                    handleTokenExpired(messageService, router);
                }
            }

            return throwError(() => error);
        })
    );
};

function handleTokenRefresh(store: Store, request: HttpRequest<unknown>, next: HttpHandlerFn, refreshToken: string, messageService: MessageService, router: Router): Observable<HttpEvent<unknown>> {
    // Dispatch refresh token action
    store.dispatch(authActions.refreshToken({refreshToken}));

    // Wait for refresh token success or failure by monitoring the loading state
    return store.select(authFeature.selectLoading).pipe(
        filter(loading => !loading), // Wait until loading is false
        take(1),
        switchMap(() => {
            // Check if we have a valid token after refresh
            const newToken = localStorage.getItem('accessToken');
            if (newToken) {
                try {
                    JwtTokenService.decodeToken(newToken);
                    const isExpired = JwtTokenService.isTokenExpired();
                    if (!isExpired) {
                        // Refresh successful, retry the original request with new token
                        const newRequest = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`,
                            },
                        });
                        return next(newRequest);
                    }
                } catch {
                    // Invalid token
                }
            }

            // Refresh failed
            handleTokenExpired(messageService, router);
            return throwError(() => new HttpErrorResponse({ status: 401 }));
        })
    );
}

function handleTokenExpired(messageService: MessageService, router: Router) {
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
