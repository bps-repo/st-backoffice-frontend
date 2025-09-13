import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { authActions } from './auth.actions';
import { Router } from '@angular/router';
import { JwtTokenService } from "../../services/jwtToken.service";
import { Store } from '@ngrx/store';
// import * as authSelectors from './auth.selectors';

@Injectable()
export class AuthEffects {
    constructor(
        private store: Store,
        private actions$: Actions,
        private authService: AuthService,
        private userProfileService: UserProfileService,
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
                    JwtTokenService.decodeToken(token);
                    this.store.dispatch(authActions.loadUserProfile());
                })
            ),
        { dispatch: false }
    );

    // Redirect to dashboard only after profile loads successfully during login
    loadUserProfileSuccessNavigate$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(authActions.loadUserProfileSuccess),
                tap((action) => {
                    // Only navigate if we're in a login context
                    this.store.select(state => (state as any).auth.shouldNavigateAfterProfileLoad).pipe(
                        take(1),
                        tap(shouldNavigate => {
                            if (shouldNavigate) {
                                this.router.navigate(['/schoolar/dashboards']).then();
                            }
                            this.store.dispatch(authActions.changeShouldNavigateAfterProfileLoad({ shouldNavigateAfterProfileLoad: false }));
                        })
                    ).subscribe();
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
                    this.userProfileService.clearCurrentUser();
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
                    this.store.dispatch(authActions.loadUserProfile());
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

    // User profile effects
    loadUserProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.loadUserProfile),
            exhaustMap(() =>
                this.userProfileService.getCurrentUser().pipe(
                    map((user) => authActions.loadUserProfileSuccess({ user })),
                    catchError((error) =>
                        of(
                            authActions.loadUserProfileFailure({
                                error: error.message || 'Failed to load user profile',
                            })
                        )
                    )
                )
            )
        )
    );

    updateUserProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.updateUserProfile),
            exhaustMap(({ userData }) =>
                this.userProfileService.updateCurrentUser(userData).pipe(
                    map((user) => authActions.updateUserProfileSuccess({ user })),
                    catchError((error) =>
                        of(
                            authActions.updateUserProfileFailure({
                                error: error.message || 'Failed to update user profile',
                            })
                        )
                    )
                )
            )
        )
    );

    updateUserPhoto$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.updateUserPhoto),
            exhaustMap(({ photoFile }) =>
                this.userProfileService.updateUserPhoto(photoFile).pipe(
                    map((user) => authActions.updateUserPhotoSuccess({ user })),
                    catchError((error) =>
                        of(
                            authActions.updateUserPhotoFailure({
                                error: error.message || 'Failed to update user photo',
                            })
                        )
                    )
                )
            )
        )
    );

    changePassword$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.changePassword),
            exhaustMap(({ currentPassword, newPassword }) =>
                this.userProfileService.changePassword(currentPassword, newPassword).pipe(
                    map(() => authActions.changePasswordSuccess()),
                    catchError((error) =>
                        of(
                            authActions.changePasswordFailure({
                                error: error.message || 'Failed to change password',
                            })
                        )
                    )
                )
            )
        )
    );

    validateToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.validateToken),
            map(() => {
                const token = localStorage.getItem('accessToken');
                let isValid = false;

                if (token) {
                    try {
                        JwtTokenService.decodeToken(token);
                        isValid = !JwtTokenService.isTokenExpired();
                    } catch {
                        isValid = false;
                    }
                }

                return authActions.validateTokenSuccess({ isValid });
            })
        )
    );
}
