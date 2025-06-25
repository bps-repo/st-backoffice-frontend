import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {StudentHistory} from "../../../models/academic/student-history";

export interface StudentHistoryState extends EntityState<StudentHistory> {
    // Loading states
    loading: boolean;
    loadingCreate: boolean;
    loadingByEventType: boolean;
    loadingByDateRange: boolean;

    // Error states
    error: string | null;
    createError: string | null;
    byEventTypeError: string | null;
    byDateRangeError: string | null;

    // Selection state
    selectedStudentHistoryId: string | null;

    // Specialized data
    studentHistoriesByEventType: { [eventType: string]: StudentHistory[] };
    studentHistoriesByDateRange: StudentHistory[];

    // Cache management
    lastFetch: number | null;
    cacheExpired: boolean;
}

export const studentHistoriesAdapter: EntityAdapter<StudentHistory> = createEntityAdapter<StudentHistory>({
    selectId: (studentHistory: StudentHistory) => studentHistory.id,
    sortComparer: (a: StudentHistory, b: StudentHistory) => {
        // Default sort by event date, most recent first
        const dateA = new Date(a.eventDate).getTime();
        const dateB = new Date(b.eventDate).getTime();
        return dateB - dateA;
    }
});

export const studentHistoriesInitialState: StudentHistoryState = studentHistoriesAdapter.getInitialState({
    // Loading states
    loading: false,
    loadingCreate: false,
    loadingByEventType: false,
    loadingByDateRange: false,

    // Error states
    error: null,
    createError: null,
    byEventTypeError: null,
    byDateRangeError: null,

    // Selection state
    selectedStudentHistoryId: null,

    // Specialized data
    studentHistoriesByEventType: {},
    studentHistoriesByDateRange: [],

    // Cache management
    lastFetch: null,
    cacheExpired: false
});
