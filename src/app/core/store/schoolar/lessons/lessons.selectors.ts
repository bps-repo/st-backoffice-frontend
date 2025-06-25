import {lessonsFeature} from "./lessons.feature";
import {lessonsAdapter} from "./lessonState";
import {createSelector} from "@ngrx/store";
import {Lesson} from "../../../models/academic/lesson";

// Basic selectors from feature
export const {
    selectLessonsState,
    selectLoading: selectLoadingLessons,
    selectSelectedLessonId,
    selectError,
    selectCreateError,
    selectUpdateError,
    selectDeleteError,
    selectLoadingCreate,
    selectLoadingUpdate,
    selectLoadingDelete,
    selectLastFetch,
    selectCacheExpired,
    selectSearchDebounceTimer,

    // Filter endpoints loading and error selectors
    selectLoadingByClass,
    selectByClassError,
    selectLoadingAvailableByClass,
    selectAvailableByClassError,
    selectLoadingByCenter,
    selectByCenterError,
    selectLoadingByDateRange,
    selectByDateRangeError,

    // Student bookings selectors
    selectLoadingStudentBookings,
    selectStudentBookingsError,
    selectLoadingStudentBookingsToday,
    selectStudentBookingsTodayError,

    // Lesson bookings selectors
    selectLoadingLessonBookings,
    selectLessonBookingsError,
    selectLoadingCreateBooking,
    selectCreateBookingError,
    selectLoadingDeleteBooking,
    selectDeleteBookingError,

    // Lesson management selectors
    selectLoadingUpdateSchedule,
    selectUpdateScheduleError,
    selectLoadingUpdateOnlineStatus,
    selectUpdateOnlineStatusError,
    selectLoadingMarkOverdue,
    selectMarkOverdueError,

    // Specialized data selectors
    selectLessonsByClass,
    selectAvailableLessonsByClass,
    selectLessonsByCenter,
    selectLessonsByDateRange,
    selectStudentBookings,
    selectStudentBookingsToday,
    selectLessonBookings
} = lessonsFeature;

// Entity adapter selectors
const {
    selectEntities,
    selectAll,
    selectIds,
    selectTotal
} = lessonsAdapter.getSelectors(lessonsFeature.selectLessonsState);

// Basic entity selectors
export const selectAllLessons = createSelector(
    selectAll,
    (lessons) => lessons
);

export const selectLessonEntities = createSelector(
    selectEntities,
    (entities) => entities
);

export const selectLessonIds = selectIds;

export const selectTotalLessons = selectTotal;

// Selected lesson selector
export const selectSelectedLesson = createSelector(
    selectLessonEntities,
    selectSelectedLessonId,
    (entities, selectedId) => selectedId ? entities[selectedId] : null
);

// Get lesson by ID
export const selectLessonById = (id: string) => createSelector(
    selectLessonEntities,
    (entities) => entities[id] || null
);

// Filter endpoints selectors
export const selectLessonsByClassId = (classId: string) => createSelector(
    selectLessonsByClass,
    (lessonsByClass) => lessonsByClass[classId] || []
);

export const selectAvailableLessonsByClassId = (classId: string) => createSelector(
    selectAvailableLessonsByClass,
    (availableLessonsByClass) => availableLessonsByClass[classId] || []
);

export const selectLessonsByCenterId = (centerId: string) => createSelector(
    selectLessonsByCenter,
    (lessonsByCenter) => lessonsByCenter[centerId] || []
);

// Student bookings selectors
export const selectStudentBookingsByStudentId = (studentId: string) => createSelector(
    selectStudentBookings,
    (studentBookings) => studentBookings[studentId] || []
);

export const selectStudentBookingsTodayByStudentId = (studentId: string) => createSelector(
    selectStudentBookingsToday,
    (studentBookingsToday) => studentBookingsToday[studentId] || []
);

// Lesson bookings selectors
export const selectLessonBookingsByLessonId = (lessonId: string) => createSelector(
    selectLessonBookings,
    (lessonBookings) => lessonBookings[lessonId] || []
);

// Error selectors
export const selectAnyError = createSelector(
    selectError,
    selectCreateError,
    selectUpdateError,
    selectDeleteError,
    selectByClassError,
    selectAvailableByClassError,
    selectByCenterError,
    selectByDateRangeError,
    selectStudentBookingsError,
    selectStudentBookingsTodayError,
    selectLessonBookingsError,
    selectCreateBookingError,
    selectDeleteBookingError,
    selectUpdateScheduleError,
    selectUpdateOnlineStatusError,
    selectMarkOverdueError,
    (error, createError, updateError, deleteError, byClassError, availableByClassError,
     byCenterError, byDateRangeError, studentBookingsError, studentBookingsTodayError,
     lessonBookingsError, createBookingError, deleteBookingError, updateScheduleError,
     updateOnlineStatusError, markOverdueError) =>
        error || createError || updateError || deleteError || byClassError ||
        availableByClassError || byCenterError || byDateRangeError ||
        studentBookingsError || studentBookingsTodayError || lessonBookingsError ||
        createBookingError || deleteBookingError || updateScheduleError ||
        updateOnlineStatusError || markOverdueError
);

// Loading selectors
export const selectAnyLoading = createSelector(
    selectLoadingLessons,
    selectLoadingCreate,
    selectLoadingUpdate,
    selectLoadingDelete,
    selectLoadingByClass,
    selectLoadingAvailableByClass,
    selectLoadingByCenter,
    selectLoadingByDateRange,
    selectLoadingStudentBookings,
    selectLoadingStudentBookingsToday,
    selectLoadingLessonBookings,
    selectLoadingCreateBooking,
    selectLoadingDeleteBooking,
    selectLoadingUpdateSchedule,
    selectLoadingUpdateOnlineStatus,
    selectLoadingMarkOverdue,
    (loading, loadingCreate, loadingUpdate, loadingDelete, loadingByClass,
     loadingAvailableByClass, loadingByCenter, loadingByDateRange,
     loadingStudentBookings, loadingStudentBookingsToday, loadingLessonBookings,
     loadingCreateBooking, loadingDeleteBooking, loadingUpdateSchedule,
     loadingUpdateOnlineStatus, loadingMarkOverdue) =>
        loading || loadingCreate || loadingUpdate || loadingDelete || loadingByClass ||
        loadingAvailableByClass || loadingByCenter || loadingByDateRange ||
        loadingStudentBookings || loadingStudentBookingsToday || loadingLessonBookings ||
        loadingCreateBooking || loadingDeleteBooking || loadingUpdateSchedule ||
        loadingUpdateOnlineStatus || loadingMarkOverdue
);

// Filtered lessons selectors
export const selectLessonsByStatus = (status: string) => createSelector(
    selectAllLessons,
    (lessons) => lessons.filter(lesson => lesson.status.toString() === status)
);

export const selectOnlineLessons = createSelector(
    selectAllLessons,
    (lessons) => lessons.filter(lesson => lesson.online)
);

export const selectInPersonLessons = createSelector(
    selectAllLessons,
    (lessons) => lessons.filter(lesson => !lesson.online)
);

export const selectUpcomingLessons = createSelector(
    selectAllLessons,
    (lessons) => lessons.filter(lesson => new Date(lesson.startDatetime) > new Date())
);

export const selectPastLessons = createSelector(
    selectAllLessons,
    (lessons) => lessons.filter(lesson => new Date(lesson.endDatetime) < new Date())
);

export const selectCurrentLessons = createSelector(
    selectAllLessons,
    (lessons) => {
        const now = new Date();
        return lessons.filter(lesson =>
            new Date(lesson.startDatetime) <= now &&
            new Date(lesson.endDatetime) >= now
        );
    }
);

// Cache selectors
export const selectShouldRefreshCache = createSelector(
    selectLastFetch,
    selectCacheExpired,
    (lastFetch, cacheExpired) => {
        if (cacheExpired) return true;
        if (!lastFetch) return true;
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        return Date.now() - lastFetch > CACHE_DURATION;
    }
);
