export enum LessonStatus {
    AVAILABLE   = 'AVAILABLE',
    BOOKED      = 'BOOKED',
    COMPLETED   = 'COMPLETED',
    CANCELLED   = 'CANCELLED',
    SCHEDULED   = 'SCHEDULED',
    POSTPONED   = 'POSTPONED',
    /** @deprecated Migrated to NOT_TAUGHT on first deploy – kept for backward compat. */
    OVERDUE     = 'OVERDUE',
    /** Lesson was actually taught (lecionado). */
    TAUGHT      = 'TAUGHT',
    /** Lesson was not taught – replaces OVERDUE after migration. */
    NOT_TAUGHT  = 'NOT_TAUGHT',
    /** Lesson was rescheduled to a different slot (reagendado). */
    RESCHEDULED = 'RESCHEDULED',
}
