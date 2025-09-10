import {createFeature, createReducer, on} from '@ngrx/store';
import {authActions} from './auth.actions';
import { initialState } from './auth.state';


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
                loading: false,
                shouldNavigateAfterProfileLoad: true
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
            loadUserProfile: false,
            loadUserProfileSuccess: false,
            loadUserProfileFailure: false,
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
        })),

        // User profile actions
        on(authActions.loadUserProfile, (state) => ({
            ...state,
            loadUserProfile: true,
            loadUserProfileSuccess: false,
            loadUserProfileFailure: false,
            error: null
        })),

        on(authActions.loadUserProfileSuccess, (state, { user }) => ({
            ...state,
            user,
            loadUserProfile: false,
            loadUserProfileSuccess: true,
            loadUserProfileFailure: false,
            error: null,
            shouldNavigateAfterProfileLoad: false
        })),

        on(authActions.loadUserProfileFailure, (state, { error }) => ({
            ...state,
            loadUserProfile: false,
            loadUserProfileFailure: true,
            loadUserProfileSuccess: false,
            error
        })),

        on(authActions.updateUserProfile, (state) => ({
            ...state,
            loadUserProfile: true,
            loadUserProfileSuccess: false,
            loadUserProfileFailure: false,
            error: null
        })),

        on(authActions.updateUserProfileSuccess, (state, { user }) => ({
            ...state,
            user,
            loadUserProfile: false,
            loadUserProfileSuccess: true,
            loadUserProfileFailure: false,
            error: null
        })),

        on(authActions.updateUserProfileFailure, (state, { error }) => ({
            ...state,
            loadUserProfile: false,
            loadUserProfileFailure: true,
            loadUserProfileSuccess: false,
            error
        })),

        on(authActions.updateUserPhoto, (state) => ({
            ...state,
            loadUserProfile: true,
            loadUserProfileSuccess: false,
            loadUserProfileFailure: false,
            error: null
        })),

        on(authActions.updateUserPhotoSuccess, (state, { user }) => ({
            ...state,
            user,
            loadUserProfile: false,
            loadUserProfileSuccess: true,
            loadUserProfileFailure: false,
            error: null
        })),

        on(authActions.updateUserPhotoFailure, (state, { error }) => ({
            ...state,
            loadUserProfile: false,
            loadUserProfileFailure: true,
            loadUserProfileSuccess: false,
            error
        })),

        on(authActions.changePassword, (state) => ({
            ...state,
            loadUserProfile: true,
            loadUserProfileSuccess: false,
            loadUserProfileFailure: false,
            error: null
        })),

        on(authActions.changePasswordSuccess, (state) => ({
            ...state,
            loadUserProfile: false,
            loadUserProfileSuccess: true,
            loadUserProfileFailure: false,
            error: null
        })),

        on(authActions.changePasswordFailure, (state, { error }) => ({
            ...state,
            loadUserProfile: false,
            loadUserProfileFailure: true,
            loadUserProfileSuccess: false,
            error
        }))
    ),
});
