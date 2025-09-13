import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {User} from '../../models/auth/user';

export const authActions = createActionGroup({
    source: 'auth',
    events: {
        // Login actions
        login: props<{ email: string; password: string }>(),
        loginSuccess: props<{ refreshToken: string; token: string }>(),
        loginFailure: props<{ error: any }>(),

        // Logout actions
        logout: emptyProps(),
        logoutSuccess: emptyProps(),
        logoutFailure: props<{ error: any }>(),

        // Refresh token actions
        refreshToken: props<{ refreshToken: string }>(),
        refreshTokenSuccess: props<{ refreshToken: string; token: string }>(),
        refreshTokenFailure: props<{ error: any }>(),


        // Verify actions
        verify: emptyProps(),
        verifySuccess: props<{ user: User }>(),
        verifyFailure: props<{ error: any }>(),

        // User profile actions
        loadUserProfile: emptyProps(),
        loadUserProfileSuccess: props<{ user: User }>(),
        loadUserProfileFailure: props<{ error: any }>(),

        // Update user profile actions
        updateUserProfile: props<{ userData: Partial<User> }>(),
        updateUserProfileSuccess: props<{ user: User }>(),
        updateUserProfileFailure: props<{ error: any }>(),

        // Update user photo actions
        updateUserPhoto: props<{ photoFile: File }>(),
        updateUserPhotoSuccess: props<{ user: User }>(),
        updateUserPhotoFailure: props<{ error: any }>(),

        // Change password actions
        changePassword: props<{ currentPassword: string; newPassword: string }>(),
        changePasswordSuccess: emptyProps(),
        changePasswordFailure: props<{ error: any }>(),

        // Clear error actions
        clearError: emptyProps(),

        // Token validation actions
        validateToken: emptyProps(),
        validateTokenSuccess: props<{ isValid: boolean }>(),

        changeShouldNavigateAfterProfileLoad: props<{ shouldNavigateAfterProfileLoad: boolean }>(),
    },
});
