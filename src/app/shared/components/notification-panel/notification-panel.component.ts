import {ChangeDetectionStrategy, Component, OnInit, ViewChild, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {BadgeModule} from 'primeng/badge';
import {OverlayPanel, OverlayPanelModule} from 'primeng/overlaypanel';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {NotificationFacadeService} from '../../../core/services/notification-facade.service';
import {Notification, NotificationType} from '../../../core/models/notification';

@Component({
    selector: 'app-notification-panel',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ButtonModule, BadgeModule, OverlayPanelModule, TooltipModule, RippleModule],
    templateUrl: './notification-panel.component.html',
    styleUrl: './notification-panel.component.scss'
})
export class NotificationPanelComponent implements OnInit {
    private facade = inject(NotificationFacadeService);

    @ViewChild('op') overlayPanel!: OverlayPanel;

    readonly notifications = this.facade.notifications;
    readonly loading = this.facade.loading;
    readonly unreadCount = this.facade.unreadCount;
    readonly hasUnread = this.facade.hasUnread;

    ngOnInit(): void {
        this.facade.load();
    }

    toggle(event: Event): void {
        this.overlayPanel.toggle(event);
    }

    markAsRead(notification: Notification): void {
        if (!notification.read) {
            this.facade.markAsRead(notification.id);
        }
    }

    markAllAsRead(): void {
        this.facade.markAllAsRead();
    }

    iconForType(type: NotificationType): string {
        const map: Record<NotificationType, string> = {
            INFO: 'pi pi-info-circle text-blue-500',
            WARNING: 'pi pi-exclamation-triangle text-yellow-500',
            ERROR: 'pi pi-times-circle text-red-500',
            SUCCESS: 'pi pi-check-circle text-green-500',
        };
        return map[type] ?? 'pi pi-bell text-blue-500';
    }
}
