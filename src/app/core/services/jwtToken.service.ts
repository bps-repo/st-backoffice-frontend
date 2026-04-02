import {Injectable} from '@angular/core';
import {User} from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class JwtTokenService {
    static decodedToken: any = null;

    /**
     * Decodes a JWT token and stores the decoded information.
     * @param token The JWT token to decode.
     */
    static decodeToken(token: string): void {
        if (!token) {
            this.decodedToken = null;
            return;
        }

        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        this.decodedToken = JSON.parse(decodedPayload);
    }

    /**
     * Checks if the token is expired.
     * @returns True if the token is expired, false otherwise.
     */
    static isTokenExpired(): boolean {
        if (!this.decodedToken || !this.decodedToken.exp) {
            return true;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime > this.decodedToken.exp;
    }
}
