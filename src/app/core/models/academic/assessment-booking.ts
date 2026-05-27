// src/app/core/models/academic/assessment-booking.ts
import { Assessment } from './assessment';
import { AssessmentBookingStatus } from '../../enums/assessment-booking-status';

export interface AssessmentBooking {
    id: string;
    assessment: Assessment;
    studentId: string;
    studentName: string;
    bookingDate: string;
    status: AssessmentBookingStatus;
}

export interface BulkBookingRequest {
    assessmentId: string;
    studentIds: string[];
}

export interface BulkBookingResultEntry {
    studentId: string;
    success: boolean;
    booking?: AssessmentBooking;
    error?: string;
}
