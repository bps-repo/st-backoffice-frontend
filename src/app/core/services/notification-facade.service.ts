import {Injectable, computed, inject, signal} from '@angular/core';
import {Notification} from '../models/notification';
import {NotificationService} from './notification.service';
import {UserProfileService} from './user-profile.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationFacadeService {
    private notificationService = inject(NotificationService);
    private userProfileService = inject(UserProfileService);

    private _notifications = signal<Notification[]>([]);
    private _loading = signal(false);
    private _error = signal<string | null>(null);

    readonly notifications = this._notifications.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    readonly unreadCount = computed(() => this._notifications().filter((n) => !n.read).length);
    readonly hasUnread = computed(() => this.unreadCount() > 0);

    private get userId(): string | null {
        return this.userProfileService.getCurrentUserValue()?.id ?? null;
    }

    load(read?: boolean): void {
        const userId = this.userId;
        if (!userId) return;

        this._loading.set(true);
        this._error.set(null);

        this.notificationService.getByUser(userId, read).subscribe({
            next: (notifications) => {
                this._notifications.set(notifications);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message);
                this._loading.set(false);
            }
        });
    }

    markAsRead(id: string): void {
        this.notificationService.markAsRead(id).subscribe({
            next: (updated) => {
                this._notifications.update((list) =>
                    list.map((n) => (n.id === id ? {...n, read: updated.read} : n))
                );
            }
        });
    }

    markAllAsRead(): void {
        const userId = this.userId;
        if (!userId) return;

        this.notificationService.markAllAsRead(userId).subscribe({
            next: () => {
                this._notifications.update((list) => list.map((n) => ({...n, read: true})));
            }
        });
    }
}
