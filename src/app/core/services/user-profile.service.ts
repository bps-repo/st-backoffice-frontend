import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, tap, catchError, finalize, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/auth/user';
import { ApiResponse } from './interfaces/ApiResponseService';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private currentUserRequest$: Observable<User> | null = null;

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        this.currentUserSubject.next(parsed);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
   * Get current user profile from the API
   * @returns Observable<User>
   */
  getCurrentUser(options: { forceRefresh?: boolean } = {}): Observable<User> {
    const { forceRefresh = false } = options;

    if (!forceRefresh) {
      const cachedUser = this.currentUserSubject.value;
      if (cachedUser) {
        return of(cachedUser);
      }
      if (this.currentUserRequest$) {
        return this.currentUserRequest$;
      }
    }

    this.currentUserRequest$ = this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`).pipe(
      map(response => response.data as User),
      tap(user => {
        this.currentUserSubject.next(user);
        try {
          localStorage.setItem('currentUser', JSON.stringify(user));
        } catch {}
      }),
      catchError(error => {
        this.clearCurrentUser();
        return throwError(() => error);
      }),
      finalize(() => {
        this.currentUserRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.currentUserRequest$;
  }

  /**
   * Get cached current user
   * @returns User | null
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Update current user profile
   * @param userData Partial user data to update
   * @returns Observable<User>
   */
  updateCurrentUser(userData: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUserValue();
    if (!currentUser) {
      throw new Error('No current user found');
    }

    return this.http.put<User>(`${this.apiUrl}/${currentUser.id}`, userData).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        try {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        } catch {}
      }),
      catchError(error => {
        console.error('Error updating user profile:', error);
        throw error;
      })
    );
  }

  /**
   * Update user avatar/photo
   * @param photoFile File to upload
   * @returns Observable<User>
   */
  updateUserPhoto(photoFile: File): Observable<User> {
    const currentUser = this.getCurrentUserValue();
    if (!currentUser) {
      throw new Error('No current user found');
    }

    const formData = new FormData();
    formData.append('photo', photoFile);

    return this.http.post<User>(`${this.apiUrl}/${currentUser.id}/photo`, formData).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        try {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        } catch {}
      }),
      catchError(error => {
        console.error('Error updating user photo:', error);
        throw error;
      })
    );
  }

  /**
   * Change user password
   * @param currentPassword Current password
   * @param newPassword New password
   * @returns Observable<any>
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const currentUser = this.getCurrentUserValue();
    if (!currentUser) {
      throw new Error('No current user found');
    }

    return this.http.post(`${this.apiUrl}/${currentUser.id}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      catchError(error => {
        console.error('Error changing password:', error);
        throw error;
      })
    );
  }

  /**
   * Get user's full name
   * @returns string
   */
  getFullName(): string {
    const user = this.getCurrentUserValue();
    if (!user) return '';
    return `${user.firstname} ${user.lastname}`.trim();
  }

  /**
   * Get user's display name (username or full name)
   * @returns string
   */
  getDisplayName(): string {
    const user = this.getCurrentUserValue();
    if (!user) return '';
    return user.username || this.getFullName();
  }

  /**
   * Get user's initials for avatar
   * @returns string
   */
  getInitials(): string {
    const user = this.getCurrentUserValue();
    if (!user) return '';
    return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
  }

  /**
   * Check if user has a photo
   * @returns boolean
   */
  hasPhoto(): boolean {
    return false;
  }

  /**
   * Get user's photo URL or default avatar
   * @returns string
   */
  getPhotoUrl(): string {
    return 'assets/layout/images/avatar.png';
  }

  /**
   * Clear current user data (useful for logout)
   */
  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.currentUserRequest$ = null;
  }

  /**
   * Refresh current user data
   * @returns Observable<User>
   */
  refreshCurrentUser(): Observable<User> {
    return this.getCurrentUser({ forceRefresh: true });
  }

  /**
   * Check if user is verified
   * @returns boolean
   */
  isUserVerified(): boolean {
    const user = this.getCurrentUserValue();
    return !!(user?.emailVerified);
  }

  /**
   * Get user's role name
   * @returns string
   */
  getRoleName(): string {
    const user = this.getCurrentUserValue();
    return user?.role?.name || '';
  }

  /**
   * Get user's role description
   * @returns string
   */
  getRoleDescription(): string {
    const user = this.getCurrentUserValue();
    return user?.role?.description || '';
  }

  /**
   * Get user's account status
   * @returns string
   */
  getAccountStatus(): string {
    const user = this.getCurrentUserValue();
    return user?.accountStatus || '';
  }

  /**
   * Check if user account is active
   * @returns boolean
   */
  isAccountActive(): boolean {
    return this.getAccountStatus() === 'ACTIVE';
  }
}
