import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { authActions } from '../store/auth/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class AppInitService {
    constructor(private store: Store) {}

    initializeApp(): Promise<any> {
        return new Promise((resolve) => {
            // Validate token on app initialization
            const token = localStorage.getItem('accessToken');
            if (token) {
                this.store.dispatch(authActions.validateToken());
            }
            resolve(true);
        });
    }
}
