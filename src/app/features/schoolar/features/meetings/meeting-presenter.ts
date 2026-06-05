// src/app/features/schoolar/features/meetings/meeting-presenter.ts
import { MeetingStatus } from 'src/app/core/enums/meeting-status';

export const MEETING_STATUS_LABELS: Record<MeetingStatus, string> = {
    [MeetingStatus.REQUESTED]: 'Solicitada',
    [MeetingStatus.CONFIRMED]: 'Confirmada',
    [MeetingStatus.CANCELLED]: 'Cancelada',
    [MeetingStatus.COMPLETED]: 'Concluída',
};

export function meetingStatusLabel(status: MeetingStatus): string {
    return MEETING_STATUS_LABELS[status] ?? status;
}

export function canCancelMeeting(status: MeetingStatus): boolean {
    return status === MeetingStatus.REQUESTED || status === MeetingStatus.CONFIRMED;
}

export function meetingStatusSeverity(
    status: MeetingStatus,
): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<MeetingStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
        [MeetingStatus.REQUESTED]: 'warn',
        [MeetingStatus.CONFIRMED]: 'info',
        [MeetingStatus.CANCELLED]: 'danger',
        [MeetingStatus.COMPLETED]: 'success',
    };
    return map[status] ?? 'secondary';
}
