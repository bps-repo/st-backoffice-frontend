export interface BulkBookingRequest {
    lessons: BulkBookingLesson[];
}

export interface BulkBookingLesson {
    lessonId: string;
    studentIds: string[];
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
    errorMessage: string;
    errorCode: string;
}
