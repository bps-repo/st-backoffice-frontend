import { HttpInterceptorFn } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs';
import { AuthState, authFeature } from '../store/auth/reducers/auth.reducers';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const excludedUrls = ['/login'];
  //const excludedUrls = ['/login', '/register'];

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
  return next(request);
};
