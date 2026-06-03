export type NotificationType = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS';
export type NotificationTargetType = 'ASSESSMENT' | 'LESSON' | 'STUDENT' | 'PAYMENT' | 'CONTRACT' | string;

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    targetId: string;
    targetType: NotificationTargetType;
    channel: NotificationChannel;
    userId: string;
    createdAt: string;
    read: boolean;
}
