import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {User} from '../../../models/auth/user';

export const authActions = createActionGroup({
    source: 'auth',
    events: {
        login: props<{ email: string; password: string }>(),
        loginSuccess: props<{ refreshToken: string; token: string }>(),
        loginFailure: props<{ error: string }>(),

        logout: emptyProps(),
        logoutSuccess: emptyProps(),
        logoutFailure: props<{ error: string }>(),

        refreshToken: props<{ refreshToken: string }>(),
        refreshTokenSuccess: props<{ refreshToken: string; token: string }>(),
        refreshTokenFailure: props<{ error: string }>(),

        verify: emptyProps(),
        verifySuccess: props<{ user: User }>(),
        verifyFailure: props<{ error: string }>(),

        clearError: emptyProps(),
    },
});
