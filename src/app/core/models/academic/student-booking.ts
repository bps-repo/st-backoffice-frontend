export interface StudentBookingLesson {
    id: string;
    title: string;
    description?: string;
    online: boolean;
    onlineLink?: string;
    startDatetime: string;
    endDatetime: string;
    status: string;
    type?: string;
    teacher: {
        name: string;
        center: string;
        email: string;
        phone: string;
    };
    unit?: {
        id: string;
        name: string;
        orderUnit: string;
        levelId: string;
        status: string;
    };
    center?: {
        id: string;
        name: string;
    };
}

export interface StudentBookingAttendance {
    id: string;
    lessonId: string;
    lessonTitle: string;
    lessonStartDatetime: string;
    studentId: string;
    studentName: string;
    status: string;
    present: boolean;
    justification?: string;
    grade?: number;
}

export interface StudentBooking {
    id: string;
    lesson: StudentBookingLesson;
    bookingDate: string;
    status: string;
    attendance?: StudentBookingAttendance;
}

export type BookingStatus = 'ALL' | 'BOOKED' | 'CANCELLED' | 'ATTENDED' | 'MISSED';
