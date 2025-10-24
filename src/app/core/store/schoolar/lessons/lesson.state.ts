import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Lesson} from "../../../models/academic/lesson";

export interface LessonState extends EntityState<Lesson> {
    // Loading states
    loading: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;
    loadingByClass: boolean;
    loadingAvailableByClass: boolean;
    loadingByCenter: boolean;
    loadingByDateRange: boolean;
    loadingStudentBookings: boolean;
    loadingStudentBookingsToday: boolean;
    loadingLessonBookings: boolean;
    loadingCreateBooking: boolean;
    loadingDeleteBooking: boolean;
    loadingUpdateSchedule: boolean;
    loadingUpdateOnlineStatus: boolean;
    loadingMarkOverdue: boolean;
    loadingBulkBooking: boolean;

    createLessonSuccess:boolean

    // Error states
    error: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    bulkError: string | null;
    byClassError: string | null;
    availableByClassError: string | null;
    byCenterError: string | null;
    byDateRangeError: string | null;
    studentBookingsError: string | null;
    studentBookingsTodayError: string | null;
    lessonBookingsError: string | null;
    createBookingError: string | null;
    deleteBookingError: string | null;
    updateScheduleError: string | null;
    updateOnlineStatusError: string | null;
    markOverdueError: string | null;
    bulkBookingError: string | null;

    // Selection state
    selectedLessonId: string | null;

    // Specialized data
    lessonsByClass: { [classId: string]: Lesson[] };
    availableLessonsByClass: { [classId: string]: Lesson[] };
    lessonsByCenter: { [centerId: string]: Lesson[] };
    lessonsByDateRange: Lesson[];
    studentBookings: { [studentId: string]: any[] };
    studentBookingsToday: { [studentId: string]: any[] };
    lessonBookings: { [lessonId: string]: any[] };

    // Cache management
    lastFetch: number | null;
    cacheExpired: boolean;

    // UI state
    searchDebounceTimer: any;
}

export const lessonsAdapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
    selectId: (lesson: Lesson) => lesson.id || '',
    sortComparer: false
});

export const lessonsInitialState: LessonState = lessonsAdapter.getInitialState({
    // Loading states
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    loadingByClass: false,
    loadingAvailableByClass: false,
    loadingByCenter: false,
    loadingByDateRange: false,
    loadingStudentBookings: false,
    loadingStudentBookingsToday: false,
    loadingLessonBookings: false,
    loadingCreateBooking: false,
    loadingDeleteBooking: false,
    loadingUpdateSchedule: false,
    loadingUpdateOnlineStatus: false,
    loadingMarkOverdue: false,
    loadingBulkBooking: false,

    createLessonSuccess: false,

    // Error states
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    bulkError: null,
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

    // Selection state
    selectedLessonId: null,

    // Specialized data
    lessonsByClass: {},
    availableLessonsByClass: {},
    lessonsByCenter: {},
    lessonsByDateRange: [],
    studentBookings: {},
    studentBookingsToday: {},
    lessonBookings: {},

    // Cache management
    lastFetch: null,
    cacheExpired: false,

    // UI state
    searchDebounceTimer: null
});
