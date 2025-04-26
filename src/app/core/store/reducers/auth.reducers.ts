import { createFeature, createReducer, on } from '@ngrx/store';
import { authActions } from '../actions/auth.actions';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(authActions.loginSuccess, (state, { token, refreshToken }) => {
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      return {
        ...state,
        isAuthenticated: true,
        token,
        refreshToken,
      };
    }),

    on(authActions.loginFailure, (state, { error }) => ({
      ...state,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      error,
    })),

    on(authActions.clearError, (state) => ({ ...state, error: null }))
  ),
});
