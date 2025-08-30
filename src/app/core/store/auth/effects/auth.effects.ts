import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { authActions } from '../actions/auth.actions';
import { Router } from '@angular/router';
import { JwtTokenService } from "../../../services/jwtToken.service";

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router
    ) {
    }

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.login),
            exhaustMap(({ email, password }) =>
                this.authService.login(email, password).pipe(
                    map((response) =>
                        authActions.loginSuccess({
                            token: response.data.accessToken,
                            refreshToken: response.data.refreshToken,
                        })
                    ),
                    catchError((error) =>
                        of(
                            authActions.loginFailure({
                                error: error.status,
                            })
                        )
                    )
                )
            )
        )
    );

    loginSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(authActions.loginSuccess),
                tap(({ token }) => {
                    JwtTokenService.decodeToken(token)
                    this.router.navigate(['/schoolar/dashboards']).then();
                })
            ),
        { dispatch: false }
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.logout),
            exhaustMap(() =>
                this.authService.logout().pipe(
                    map(() => authActions.logoutSuccess()),
                    catchError((error) =>
                        of(
                            authActions.logoutFailure({
                                error: error.status,
                            })
                        )
                    )
                )
            )
        )
    );

    logoutSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(authActions.logoutSuccess),
                tap(() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    this.router.navigate(['/auth/login']).then();
                })
            ),
        { dispatch: false }
    );

    refreshToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.refreshToken),
            exhaustMap(({ refreshToken }) =>
                this.authService.refreshToken(refreshToken).pipe(
                    map((response) =>
                        authActions.refreshTokenSuccess({
                            token: response.data.accessToken,
                            refreshToken: response.data.refreshToken,
                        })
                    ),
                    catchError((error) =>
                        of(
                            authActions.refreshTokenFailure({
                                error: error.status,
                            })
                        )
                    )
                )
            )
        )
    );

    refreshTokenSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(authActions.refreshTokenSuccess),
                tap(({ token }) => {
                    JwtTokenService.decodeToken(token);
                })
            ),
        { dispatch: false }
    );

    verify$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.verify),
            exhaustMap(() =>
                this.authService.verify().pipe(
                    map((response) => authActions.verifySuccess({ user: response.data })),
                    catchError((error) =>
                        of(
                            authActions.verifyFailure({
                                error: error.status,
                            })
                        )
                    )
                )
            )
        )
    );
}
