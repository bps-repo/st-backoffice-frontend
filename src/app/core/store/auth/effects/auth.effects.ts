import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { authActions } from '../actions/auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router
    ) {}

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
                tap(() => {
                    this.router.navigate(['/schoolar/dashboards']);
                })
            ),
        { dispatch: false }
    );
}
