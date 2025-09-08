export interface BulkBookingRequest {
    lessons: BulkBookingLesson[];
}

export interface BulkBookingLesson {
    lessonId: string;
    studentIds: string[];
}

export interface BulkBookingResponse {
    success: boolean;
    data: BulkBookingResult;
    timestamp: string;
    metadata: any[];
}

export interface BulkBookingResult {
    totalProcessed: number;
    successfulBookings: number;
    failedBookings: number;
    successfulBookingsList: SuccessfulBooking[];
    failedBookingsList: FailedBooking[];
}

export interface SuccessfulBooking {
    bookingId: string;
    lessonId: string;
    studentId: string;
    status: string;
}

export interface FailedBooking {
    lessonId: string;
    studentId: string;
    error: string;
    reason?: string;
}
