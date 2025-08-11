import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {JwtTokenService} from "../services/jwtToken.service";
import {MessageService} from "primeng/api";

export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(JwtTokenService);
    const messageService = inject(MessageService);

    const excludedUrls = ['/login'];

    if (excludedUrls.some((url) => req.url.includes(url))) {
        return next(req);
    }

    if (JwtTokenService.isTokenExpired()) {
        messageService.add({
            severity: 'warn',
            summary: 'Sessão expirada!',
            detail: 'A tua sessão expirou. Por favor, Faça login novamente.',
            life: 5000
        });

        localStorage.removeItem('accessToken');
    }
    return next(req);
};

