import {createFeature, createReducer, on} from '@ngrx/store';
import {LESSONS_FEATURE_KEY, lessonsActions} from './lessons.actions';
import {lessonsAdapter, lessonsInitialState} from "./lesson.state";

// Create feature
export const lessonsFeature = createFeature({
    name: LESSONS_FEATURE_KEY,
    reducer: createReducer(
        lessonsInitialState,
        // Load lessons
        on(lessonsActions.loadLessons, (state) => ({
            ...state,
            loading: state.ids.length > 0 ? false : true,
            error: null,
        })),
        on(lessonsActions.loadLessonsSuccess, (state, {lessons}) =>
            lessonsAdapter.setAll(lessons, {
                ...state,
                loading: false,
                error: null,
                lastFetch: Date.now(),
                cacheExpired: false,
            })
        ),
        on(lessonsActions.loadLessonsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Load lesson
        on(lessonsActions.loadLesson, (state) => ({
            ...state,
            loading: state.ids.length > 0 ? false : true,
            error: null,
        })),
        on(lessonsActions.loadLessonSuccess, (state, {lesson}) =>
            lessonsAdapter.upsertOne(lesson, {
                ...state,
                selectedLessonId: lesson.id!,
                loading: false,
                error: null,
            })
        ),
        on(lessonsActions.loadLessonFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Create lesson
        on(lessonsActions.createLesson, (state) => ({
            ...state,
            loadingCreate: true,
            createError: null,
        })),
        on(lessonsActions.createLessonSuccess, (state, {lesson}) =>
            lessonsAdapter.addOne(lesson, {
                ...state,
                loadingCreate: false,
                createError: null,
            })
        ),
        on(lessonsActions.createLessonFailure, (state, {error}) => ({
            ...state,
            loadingCreate: false,
            createError: error,
        })),

        // Update lesson
        on(lessonsActions.updateLesson, (state) => ({
            ...state,
            loadingUpdate: true,
            updateError: null,
        })),
        on(lessonsActions.updateLessonSuccess, (state, {lesson}) =>
            lessonsAdapter.updateOne(
                {id: lesson.id!, changes: lesson},
                {
                    ...state,
                    loadingUpdate: false,
                    updateError: null,
                }
            )
        ),
        on(lessonsActions.updateLessonFailure, (state, {error}) => ({
            ...state,
            loadingUpdate: false,
            updateError: error,
        })),

        // Delete lesson
        on(lessonsActions.deleteLesson, (state) => ({
            ...state,
            loadingDelete: true,
            deleteError: null,
        })),
        on(lessonsActions.deleteLessonSuccess, (state, {id}) =>
            lessonsAdapter.removeOne(id, {
                ...state,
                selectedLessonId: state.selectedLessonId === id ? null : state.selectedLessonId,
                loadingDelete: false,
                deleteError: null,
            })
        ),
        on(lessonsActions.deleteLessonFailure, (state, {error}) => ({
            ...state,
            loadingDelete: false,
            deleteError: error,
        })),

        // Filter endpoints - Load lessons by class
        on(lessonsActions.loadLessonsByClass, (state) => ({
            ...state,
            loadingByClass: true,
            byClassError: null,
        })),
        on(lessonsActions.loadLessonsByClassSuccess, (state, {lessons}) => ({
            ...state,
            lessonsByClass: {
                ...state.lessonsByClass,
                [lessons.length > 0 && lessons[0].classEntity ? lessons[0].classEntity.id! : 'unknown']: lessons
            },
            loadingByClass: false,
            byClassError: null,
        })),
        on(lessonsActions.loadLessonsByClassFailure, (state, {error}) => ({
            ...state,
            loadingByClass: false,
            byClassError: error,
        })),

        // Filter endpoints - Load available lessons by class
        on(lessonsActions.loadAvailableLessonsByClass, (state) => ({
            ...state,
            loadingAvailableByClass: true,
            availableByClassError: null,
        })),
        on(lessonsActions.loadAvailableLessonsByClassSuccess, (state, {lessons}) => ({
            ...state,
            availableLessonsByClass: {
                ...state.availableLessonsByClass,
                [lessons.length > 0 && lessons[0].classEntity ? lessons[0].classEntity.id! : 'unknown']: lessons
            },
            loadingAvailableByClass: false,
            availableByClassError: null,
        })),
        on(lessonsActions.loadAvailableLessonsByClassFailure, (state, {error}) => ({
            ...state,
            loadingAvailableByClass: false,
            availableByClassError: error,
        })),

        // Filter endpoints - Load lessons by center
        on(lessonsActions.loadLessonsByCenter, (state) => ({
            ...state,
            loadingByCenter: true,
            byCenterError: null,
        })),
        on(lessonsActions.loadLessonsByCenterSuccess, (state, {lessons}) => ({
            ...state,
            lessonsByCenter: {
                ...state.lessonsByCenter,
                [lessons.length > 0 && lessons[0].center ?
                    (typeof lessons[0].center === 'string' ? lessons[0].center : lessons[0].center.id!) :
                    'unknown']: lessons
            },
            loadingByCenter: false,
            byCenterError: null,
        })),
        on(lessonsActions.loadLessonsByCenterFailure, (state, {error}) => ({
            ...state,
            loadingByCenter: false,
            byCenterError: error,
        })),

        // Filter endpoints - Load lessons by date range
        on(lessonsActions.loadLessonsByDateRange, (state) => ({
            ...state,
            loadingByDateRange: true,
            byDateRangeError: null,
        })),
        on(lessonsActions.loadLessonsByDateRangeSuccess, (state, {lessons}) => ({
            ...state,
            lessonsByDateRange: lessons,
            loadingByDateRange: false,
            byDateRangeError: null,
        })),
        on(lessonsActions.loadLessonsByDateRangeFailure, (state, {error}) => ({
            ...state,
            loadingByDateRange: false,
            byDateRangeError: error,
        })),

        // Student bookings endpoints - Load student bookings
        on(lessonsActions.loadStudentBookings, (state) => ({
            ...state,
            loadingStudentBookings: true,
            studentBookingsError: null,
        })),
        on(lessonsActions.loadStudentBookingsSuccess, (state, {bookings}) => ({
            ...state,
            studentBookings: {
                ...state.studentBookings,
                [bookings.length > 0 && bookings[0].student ? bookings[0].student.id! : 'unknown']: bookings
            },
            loadingStudentBookings: false,
            studentBookingsError: null,
        })),
        on(lessonsActions.loadStudentBookingsFailure, (state, {error}) => ({
            ...state,
            loadingStudentBookings: false,
            studentBookingsError: error,
        })),

        // Student bookings endpoints - Load student bookings today
        on(lessonsActions.loadStudentBookingsToday, (state) => ({
            ...state,
            loadingStudentBookingsToday: true,
            studentBookingsTodayError: null,
        })),
        on(lessonsActions.loadStudentBookingsTodaySuccess, (state, {bookings}) => ({
            ...state,
            studentBookingsToday: {
                ...state.studentBookingsToday,
                [bookings.length > 0 && bookings[0].student ? bookings[0].student.id! : 'unknown']: bookings
            },
            loadingStudentBookingsToday: false,
            studentBookingsTodayError: null,
        })),
        on(lessonsActions.loadStudentBookingsTodayFailure, (state, {error}) => ({
            ...state,
            loadingStudentBookingsToday: false,
            studentBookingsTodayError: error,
        })),

        // Lesson bookings endpoints - Load lesson bookings
        on(lessonsActions.loadLessonBookings, (state) => ({
            ...state,
            loadingLessonBookings: true,
            lessonBookingsError: null,
        })),
        on(lessonsActions.loadLessonBookingsSuccess, (state, {bookings}) => ({
            ...state,
            lessonBookings: {
                ...state.lessonBookings,
                [bookings.length > 0 && bookings[0].lesson ? bookings[0].lesson.id! : 'unknown']: bookings
            },
            loadingLessonBookings: false,
            lessonBookingsError: null,
        })),
        on(lessonsActions.loadLessonBookingsFailure, (state, {error}) => ({
            ...state,
            loadingLessonBookings: false,
            lessonBookingsError: error,
        })),

        // Lesson bookings endpoints - Create lesson booking
        on(lessonsActions.createLessonBooking, (state) => ({
            ...state,
            loadingCreateBooking: true,
            createBookingError: null,
        })),
        on(lessonsActions.createLessonBookingSuccess, (state, {booking}) => {
            const lessonId = booking.lesson?.id || 'unknown';
            const existingBookings = state.lessonBookings[lessonId] || [];
            return {
                ...state,
                lessonBookings: {
                    ...state.lessonBookings,
                    [lessonId]: [...existingBookings, booking]
                },
                loadingCreateBooking: false,
                createBookingError: null,
            };
        }),
        on(lessonsActions.createLessonBookingFailure, (state, {error}) => ({
            ...state,
            loadingCreateBooking: false,
            createBookingError: error,
        })),

        // Lesson bookings endpoints - Delete lesson booking
        on(lessonsActions.deleteLessonBooking, (state) => ({
            ...state,
            loadingDeleteBooking: true,
            deleteBookingError: null,
        })),
        on(lessonsActions.deleteLessonBookingSuccess, (state, {lessonId, bookingId}) => {
            const existingBookings = state.lessonBookings[lessonId] || [];
            return {
                ...state,
                lessonBookings: {
                    ...state.lessonBookings,
                    [lessonId]: existingBookings.filter(booking => booking.id !== bookingId)
                },
                loadingDeleteBooking: false,
                deleteBookingError: null,
            };
        }),
        on(lessonsActions.deleteLessonBookingFailure, (state, {error}) => ({
            ...state,
            loadingDeleteBooking: false,
            deleteBookingError: error,
        })),

        // Lesson management endpoints - Update lesson schedule
        on(lessonsActions.updateLessonSchedule, (state) => ({
            ...state,
            loadingUpdateSchedule: true,
            updateScheduleError: null,
        })),
        on(lessonsActions.updateLessonScheduleSuccess, (state, {lesson}) =>
            lessonsAdapter.updateOne(
                {id: lesson.id!, changes: lesson},
                {
                    ...state,
                    loadingUpdateSchedule: false,
                    updateScheduleError: null,
                }
            )
        ),
        on(lessonsActions.updateLessonScheduleFailure, (state, {error}) => ({
            ...state,
            loadingUpdateSchedule: false,
            updateScheduleError: error,
        })),

        // Lesson management endpoints - Update lesson online status
        on(lessonsActions.updateLessonOnlineStatus, (state) => ({
            ...state,
            loadingUpdateOnlineStatus: true,
            updateOnlineStatusError: null,
        })),
        on(lessonsActions.updateLessonOnlineStatusSuccess, (state, {lesson}) =>
            lessonsAdapter.updateOne(
                {id: lesson.id!, changes: lesson},
                {
                    ...state,
                    loadingUpdateOnlineStatus: false,
                    updateOnlineStatusError: null,
                }
            )
        ),
        on(lessonsActions.updateLessonOnlineStatusFailure, (state, {error}) => ({
            ...state,
            loadingUpdateOnlineStatus: false,
            updateOnlineStatusError: error,
        })),

        // Lesson management endpoints - Mark lessons overdue
        on(lessonsActions.markLessonsOverdue, (state) => ({
            ...state,
            loadingMarkOverdue: true,
            markOverdueError: null,
        })),
        on(lessonsActions.markLessonsOverdueSuccess, (state) => ({
            ...state,
            loadingMarkOverdue: false,
            markOverdueError: null,
            cacheExpired: true, // Force a refresh of lessons after marking overdue
        })),
        on(lessonsActions.markLessonsOverdueFailure, (state, {error}) => ({
            ...state,
            loadingMarkOverdue: false,
            markOverdueError: error,
        })),

        // Bulk booking endpoints
        on(lessonsActions.bulkBookLessons, (state) => ({
            ...state,
            loadingBulkBooking: true,
            bulkBookingError: null,
        })),
        on(lessonsActions.bulkBookLessonsSuccess, (state, {response}) => ({
            ...state,
            loadingBulkBooking: false,
            bulkBookingError: null,
        })),
        on(lessonsActions.bulkBookLessonsFailure, (state, {error}) => ({
            ...state,
            loadingBulkBooking: false,
            bulkBookingError: error,
        })),

        // Clear error
        on(lessonsActions.clearError, (state) => ({
            ...state,
            error: null,
            createError: null,
            updateError: null,
            deleteError: null,
            byClassError: null,
            availableByClassError: null,
            byCenterError: null,
            byDateRangeError: null,
            studentBookingsError: null,
            studentBookingsTodayError: null,
            lessonBookingsError: null,
            createBookingError: null,
            deleteBookingError: null,
            updateScheduleError: null,
            updateOnlineStatusError: null,
            markOverdueError: null,
            bulkBookingError: null,
        }))
    ),
});
