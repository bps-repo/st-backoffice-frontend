import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, tap, catchError, finalize, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/auth/user';
import { ApiResponse } from '../models/ApiResponseService';


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
                localStorage.setItem('currentUser', JSON.stringify(user));
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

    getCurrentUserValue(): User | null {
        return this.currentUserSubject.value;
    }


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
                } catch { }
            }),
            catchError(error => {
                console.error('Error updating user profile:', error);
                throw error;
            })
        );
    }

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
                } catch { }
            }),
            catchError(error => {
                console.error('Error updating user photo:', error);
                throw error;
            })
        );
    }


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


    getFullName(): string {
        const user = this.getCurrentUserValue();
        if (!user) return '';
        return `${user.firstname} ${user.lastname}`.trim();
    }


    getDisplayName(): string {
        const user = this.getCurrentUserValue();
        if (!user) return '';
        return user.username || this.getFullName();
    }


    getInitials(): string {
        const user = this.getCurrentUserValue();
        if (!user) return '';
        return `${user?.firstname.charAt(0)}${user?.lastname.charAt(0)}`.toUpperCase();
    }
    hasPhoto(): boolean {
        return false;
    }


    getPhotoUrl(): string {
        return 'assets/layout/images/avatar.png';
    }

    clearCurrentUser(): void {
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
        this.currentUserRequest$ = null;
    }


    refreshCurrentUser(): Observable<User> {
        return this.getCurrentUser({ forceRefresh: true });
    }

    isUserVerified(): boolean {
        const user = this.getCurrentUserValue();
        return !!(user?.emailVerified);
    }


    getRoleName(): string {
        const user = this.getCurrentUserValue();
        return user?.role?.name || '';
    }

    getRoleDescription(): string {
        const user = this.getCurrentUserValue();
        return user?.role?.description || '';
    }

    getAccountStatus(): string {
        const user = this.getCurrentUserValue();
        return user?.accountStatus || '';
    }

    isAccountActive(): boolean {
        return this.getAccountStatus() === 'ACTIVE';
    }
}
