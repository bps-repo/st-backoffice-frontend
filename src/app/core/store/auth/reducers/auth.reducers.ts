import {createFeature, createReducer, on} from '@ngrx/store';
import {authActions} from '../actions/auth.actions';
import {User} from '../../../models/auth/user';

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    refreshToken: string | null;
    user: User | null;
    error: string | null;
    loading: boolean;
}

export const initialState: AuthState = {
    isAuthenticated: false,
    token: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: null,
    error: null,
    loading: false
};

export const authFeature = createFeature({
    name: 'auth',
    reducer: createReducer(
        initialState,
        // Login actions
        on(authActions.login, (state) => ({
            ...state,
            loading: true,
            error: null
        })),

        on(authActions.loginSuccess, (state, {token, refreshToken}) => {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            return {
                ...state,
                isAuthenticated: true,
                token,
                refreshToken,
                error: null,
                loading: false
            };
        }),

        on(authActions.loginFailure, (state, {error}) => ({
            ...state,
            isAuthenticated: false,
            token: null,
            refreshToken: null,
            error,
            loading: false
        })),

        // Logout actions
        on(authActions.logout, (state) => ({
            ...state,
            loading: true,
            error: null
        })),

        on(authActions.logoutSuccess, (state) => ({
            ...state,
            isAuthenticated: false,
            token: null,
            refreshToken: null,
            user: null,
            error: null,
            loading: false
        })),

        on(authActions.logoutFailure, (state, {error}) => ({
            ...state,
            error,
            loading: false
        })),

        // Refresh token actions
        on(authActions.refreshToken, (state) => ({
            ...state,
            loading: true,
            error: null
        })),

        on(authActions.refreshTokenSuccess, (state, {token, refreshToken}) => {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            return {
                ...state,
                isAuthenticated: true,
                token,
                refreshToken,
                error: null,
                loading: false
            };
        }),

        on(authActions.refreshTokenFailure, (state, {error}) => ({
            ...state,
            isAuthenticated: false,
            token: null,
            refreshToken: null,
            error,
            loading: false
        })),

        // Verify actions
        on(authActions.verify, (state) => ({
            ...state,
            loading: true,
            error: null
        })),

        on(authActions.verifySuccess, (state, {user}) => ({
            ...state,
            isAuthenticated: true,
            user,
            error: null,
            loading: false
        })),

        on(authActions.verifyFailure, (state, {error}) => ({
            ...state,
            isAuthenticated: false,
            user: null,
            error,
            loading: false
        })),

        on(authActions.clearError, (state) => ({
            ...state,
            error: null
        }))
    ),
});
