import { Pipe, PipeTransform } from '@angular/core';
import { Lesson } from '../../core/models/academic/lesson';
import { Attendance } from '../../core/models/academic/attendance';
import { LessonStatus } from '../../core/enums/lesson-status';

/**
 * Returns the PrimeNG severity (or a custom sentinel string) for a lesson.
 *
 * Custom sentinel strings ("planned", "rescheduled") are NOT valid PrimeNG
 * severities – they are used together with lessonStatusClass to apply
 * custom colours via styleClass.  Standard statuses map to native
 * PrimeNG severities so no extra CSS is needed.
 *
 * Modes:
 *   'status'   (default)
 *   'modality'           – "info" (online) | "secondary" (presencial)
 *
 * Usage:
 *   [severity]="lesson | lessonStatusSeverity"
 *   [severity]="lesson | lessonStatusSeverity : 'modality'"
 */
@Pipe({ name: 'lessonStatusSeverity', standalone: true, pure: true })
export class LessonStatusSeverityPipe implements PipeTransform {

    transform(
        value: Lesson | string | null | undefined,
        mode: 'status' | 'modality' = 'status',
        startDatetime?: string | Date,
        attendances?: Attendance[]
    ): string | undefined {
        if (value == null) return 'secondary';

        // ── Modality mode ─────────────────────────────────────────────────────
        if (mode === 'modality') {
            if (typeof value === 'object') {
                return (value as Lesson).online ? 'info' : 'secondary';
            }
            return 'secondary';
        }

        // ── Status mode ───────────────────────────────────────────────────────
        if (typeof value === 'object') {
            const lesson = value as Lesson;
            return resolveStatusSeverity(
                lesson.status as string,
                lesson.startDatetime,
                attendances ?? (lesson.attendances as Attendance[] | undefined)
            );
        }

        return resolveStatusSeverity(value, startDatetime, attendances);
    }
}

/**
 * Pure severity resolver.
 *
 * Returns a PrimeNG severity for standard states, and a custom sentinel
 * string for states that need bespoke CSS via lessonStatusClass:
 *   'planned'    → .lesson-status-planned   (indigo / purple)
 *   'rescheduled'→ .lesson-status-rescheduled (amber)
 *   'no-attendance'→ .lesson-status-no-attendance (orange)
 */
export function resolveStatusSeverity(
    status: string,
    startDatetime?: string | Date,
    attendances?: Attendance[]
): string | undefined {
    if (status === LessonStatus.CANCELLED) return 'danger';

    if (startDatetime && isFuture(startDatetime) && status !== LessonStatus.COMPLETED) {
        return 'planned';          // custom – handled via styleClass
    }

    if (status === LessonStatus.POSTPONED) return 'rescheduled'; // custom

    if (status === LessonStatus.COMPLETED || status === LessonStatus.OVERDUE) {
        if (attendances && attendances.length > 0) {
            return attendances.some(a => a.present) ? 'success' : 'no-attendance'; // last is custom
        }
        return 'success';
    }

    switch (status) {
        case LessonStatus.AVAILABLE:  return 'success';
        case LessonStatus.BOOKED:     return 'info';
        case LessonStatus.SCHEDULED:  return 'info';
        default:                      return 'secondary';
    }
}

function isFuture(value: string | Date): boolean {
    const d = value instanceof Date ? value : new Date(value);
    return d > new Date();
}
