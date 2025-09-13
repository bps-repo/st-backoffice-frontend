import { User } from "../../models/auth/user";
import { JwtTokenService } from "../../services/jwtToken.service";

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
    shouldNavigateAfterProfileLoad: boolean;
}

// Helper function to check if token is valid
function isTokenValid(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
        JwtTokenService.decodeToken(token);
        return !JwtTokenService.isTokenExpired();
    } catch {
        return false;
    }
}

export const initialState: AuthState = {
    isAuthenticated: isTokenValid(),
    token: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: null,
    error: null,
    loading: false,
    loadUserProfile: false,
    loadUserProfileSuccess: false,
    loadUserProfileFailure: false,
    shouldNavigateAfterProfileLoad: false
};
