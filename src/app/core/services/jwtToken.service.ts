import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  private decodedToken: any = null;

  /**
   * Decodes a JWT token and stores the decoded information.
   * @param token The JWT token to decode.
   */
  decodeToken(token: string): void {
    if (!token) {
      this.decodedToken = null;
      return;
    }

    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    this.decodedToken = JSON.parse(decodedPayload);
  }

  /**
   * Retrieves the decoded token.
   * @returns The decoded token object or null if no token is decoded.
   */
  getDecodedToken(): any {
    return this.decodedToken;
  }

  /**
   * Retrieves a specific claim from the decoded token.
   * @param claim The claim to retrieve (e.g., 'sub', 'email').
   * @returns The value of the claim or null if not found.
   */
  getClaim(claim: string): any {
    return this.decodedToken ? this.decodedToken[claim] : null;
  }

  /**
   * Checks if the token is expired.
   * @returns True if the token is expired, false otherwise.
   */
  isTokenExpired(): boolean {
    if (!this.decodedToken || !this.decodedToken.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return currentTime > this.decodedToken.exp;
  }

  static getUser(): User | null {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return null;
    }

    console.log('Token:', token);
    const payload = token.split('.')[1]; // Extract the payload part of the token
    const decodedPayload = atob(payload); // Decode the base64-encoded payload
    const decodedToken = JSON.parse(decodedPayload);

    if (!decodedToken) {
      return null;
    }

    const user: User = {

      id: decodedToken['id'],
      name: decodedToken['name'],
      email: decodedToken['sub'],
    };

    return user;
  }
}
