import { User } from "../../models/auth/user";

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    refreshToken: string | null;
    user: User | null;
    error: any | null;
    loading: boolean;

    loadUserProfile: boolean;
    loadUserProfileSuccess: boolean;
    loadUserProfileFailure: boolean;
}

export const initialState: AuthState = {
    isAuthenticated: false,
    token: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: null,
    error: null,
    loading: false,
    loadUserProfile: false,
    loadUserProfileSuccess: false,
    loadUserProfileFailure: false
};
