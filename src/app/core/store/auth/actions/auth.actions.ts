import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    login: props<{ email: string; password: string }>(),
    loginSuccess: props<{ refreshToken: string; token: string }>(),
    loginFailure: props<{ error: string }>(),
    logout: emptyProps(),
    logoutSuccess: emptyProps(),
    logoutFailure: props<{ error: string }>(),
    clearError: emptyProps(), //limpar mensagens de erro.
  },
});
