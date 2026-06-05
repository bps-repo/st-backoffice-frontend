// src/app/core/models/academic/meeting.ts
import { MeetingStatus } from '../../enums/meeting-status';

export interface Meeting {
    id: string;
    studentId: string;
    studentName: string;
    employeeId: string;
    employeeName: string;
    createdByUserId: string;
    createdByName: string;
    startAt: string;
    endAt: string;
    purpose: string;
    online: boolean;
    onlineLink?: string;
    location?: string;
    status: MeetingStatus;
    createdAt: string;
    updatedAt: string;
}

export interface MeetingListFilter {
    studentId?: string;
    employeeId?: string;
    status?: MeetingStatus;
    startAt?: string;
    endAt?: string;
}

export interface CreateMeetingRequest {
    studentId: string;
    employeeId: string;
    startAt: string;
    endAt: string;
    purpose: string;
    online: boolean;
    onlineLink?: string;
}

export interface UpdateMeetingRequest {
    studentId?: string;
    employeeId?: string;
    startAt?: string;
    endAt?: string;
    purpose?: string;
    online?: boolean;
    onlineLink?: string;
    location?: string;
    status?: MeetingStatus;
}
