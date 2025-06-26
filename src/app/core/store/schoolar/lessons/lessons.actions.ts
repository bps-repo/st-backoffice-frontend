import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Lesson} from 'src/app/core/models/academic/lesson';

export const LESSONS_FEATURE_KEY = 'lessons';

export const lessonsActions = createActionGroup({
    source: LESSONS_FEATURE_KEY,
    events: {
        // Load lessons
        'Load lessons': emptyProps(),
        'Load lessons Success': props<{ lessons: Lesson[] }>(),
        'Load lessons Failure': props<{ error: string }>(),

        // Load Lesson
        'Load Lesson': props<{ id: string }>(),
        'Load Lesson Success': props<{ lesson: Lesson }>(),
        'Load Lesson Failure': props<{ error: string }>(),

        // Create Lesson
        'Create Lesson': props<{ lesson: Lesson }>(),
        'Create Lesson Success': props<{ lesson: Lesson }>(),
        'Create Lesson Failure': props<{ error: string }>(),

        // Update Lesson
        'Update Lesson': props<{ lesson: Lesson }>(),
        'Update Lesson Success': props<{ lesson: Lesson }>(),
        'Update Lesson Failure': props<{ error: string }>(),

        // Delete Lesson
        'Delete Lesson': props<{ id: string }>(),
        'Delete Lesson Success': props<{ id: string }>(),
        'Delete Lesson Failure': props<{ error: string }>(),

        // Filter endpoints
        'Load Lessons By Class': props<{ classId: string }>(),
        'Load Lessons By Class Success': props<{ lessons: Lesson[] }>(),
        'Load Lessons By Class Failure': props<{ error: string }>(),

        'Load Available Lessons By Class': props<{ classId: string }>(),
        'Load Available Lessons By Class Success': props<{ lessons: Lesson[] }>(),
        'Load Available Lessons By Class Failure': props<{ error: string }>(),

        'Load Lessons By Center': props<{ centerId: string }>(),
        'Load Lessons By Center Success': props<{ lessons: Lesson[] }>(),
        'Load Lessons By Center Failure': props<{ error: string }>(),

        'Load Lessons By Date Range': props<{ startDate: string, endDate: string }>(),
        'Load Lessons By Date Range Success': props<{ lessons: Lesson[] }>(),
        'Load Lessons By Date Range Failure': props<{ error: string }>(),

        // Student bookings endpoints
        'Load Student Bookings': props<{ studentId: string }>(),
        'Load Student Bookings Success': props<{ bookings: any[] }>(),
        'Load Student Bookings Failure': props<{ error: string }>(),

        'Load Student Bookings Today': props<{ studentId: string }>(),
        'Load Student Bookings Today Success': props<{ bookings: any[] }>(),
        'Load Student Bookings Today Failure': props<{ error: string }>(),

        // Lesson bookings endpoints
        'Load Lesson Bookings': props<{ lessonId: string }>(),
        'Load Lesson Bookings Success': props<{ bookings: any[] }>(),
        'Load Lesson Bookings Failure': props<{ error: string }>(),

        'Create Lesson Booking': props<{ lessonId: string, bookingData: any }>(),
        'Create Lesson Booking Success': props<{ booking: any }>(),
        'Create Lesson Booking Failure': props<{ error: string }>(),

        'Delete Lesson Booking': props<{ lessonId: string, bookingId: string }>(),
        'Delete Lesson Booking Success': props<{ lessonId: string, bookingId: string }>(),
        'Delete Lesson Booking Failure': props<{ error: string }>(),

        // Lesson management endpoints
        'Update Lesson Schedule': props<{ lessonId: string, scheduleData: any }>(),
        'Update Lesson Schedule Success': props<{ lesson: Lesson }>(),
        'Update Lesson Schedule Failure': props<{ error: string }>(),

        'Update Lesson Online Status': props<{ lessonId: string, onlineStatus: boolean }>(),
        'Update Lesson Online Status Success': props<{ lesson: Lesson }>(),
        'Update Lesson Online Status Failure': props<{ error: string }>(),

        'Mark Lessons Overdue': emptyProps(),
        'Mark Lessons Overdue Success': props<{ response: any }>(),
        'Mark Lessons Overdue Failure': props<{ error: string }>(),

        // Clear error
        'Clear Error': emptyProps(),
    },
});
