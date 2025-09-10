import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {JwtTokenService} from "../services/jwtToken.service";
import {MessageService} from "primeng/api";
import {Store} from '@ngrx/store';
import {authActions} from '../store/auth/auth.actions';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(JwtTokenService);
    const messageService = inject(MessageService);
    const store = inject(Store);
    const router = inject(Router);

    const excludedUrls = ['/login', '/refresh-token'];

    if (excludedUrls.some((url) => req.url.includes(url))) {
        return next(req);
    }

    if (JwtTokenService.isTokenExpired()) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            // Try to refresh the token
            store.dispatch(authActions.refreshToken({refreshToken}));

            // Return the original request
            return next(req).pipe(
                catchError(error => {
                    // If we get a 401 or 403 error, the refresh token might be invalid
                    if (error.status === 401 || error.status === 403) {
                        messageService.add({
                            severity: 'warn',
                            summary: 'Sessão expirada!',
                            detail: 'A tua sessão expirou. Por favor, Faça login novamente.',
                            life: 5000
                        });

                        // Clear tokens and redirect to login
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        router.navigate(['/auth/login']).then();
                    }
                    return throwError(() => error);
                })
            );
        } else {
            // No refresh token available, show message and redirect to login
            messageService.add({
                severity: 'warn',
                summary: 'Sessão expirada!',
                detail: 'A tua sessão expirou. Por favor, Faça login novamente.',
                life: 5000
            });

            localStorage.removeItem('accessToken');
            router.navigate(['/auth/login']).then();
        }
    }
    return next(req);
};

