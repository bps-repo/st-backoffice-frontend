import { Pipe, PipeTransform } from '@angular/core';
import { Lesson } from '../../core/models/academic/lesson';
import { Attendance } from '../../core/models/academic/attendance';
import { LessonStatus } from '../../core/enums/lesson-status';

/**
 * Derives a human-readable Portuguese label for a lesson based on:
 *  - Its status field
 *  - Its start datetime  (future lessons  → "Aula Prevista")
 *  - Its attendance data (past + no-show  → "Aula sem Presença")
 *
 * Modes:
 *   'status'   (default) – booking / progression state
 *   'modality'           – "Aula Online" | "Aula Presencial"
 *
 * Usage:
 *   {{ lesson | lessonStatusLabel }}
 *   {{ lesson | lessonStatusLabel : 'modality' }}
 *   {{ row.status | lessonStatusLabel : 'status' : row.startDatetime }}
 */
@Pipe({ name: 'lessonStatusLabel', standalone: true, pure: true })
export class LessonStatusLabelPipe implements PipeTransform {

    transform(
        value: Lesson | string | null | undefined,
        mode: 'status' | 'modality' = 'status',
        startDatetime?: string | Date,
        attendances?: Attendance[]
    ): string {
        if (value == null) return 'Desconhecido';

        // ── Modality mode ─────────────────────────────────────────────────────
        if (mode === 'modality') {
            if (typeof value === 'object') {
                return (value as Lesson).online ? 'Aula Online' : 'Aula Presencial';
            }
            return 'Aula Presencial';
        }

        // ── Status mode ───────────────────────────────────────────────────────
        if (typeof value === 'object') {
            const lesson = value as Lesson;
            return resolveStatusLabel(
                lesson.status as string,
                lesson.startDatetime,
                attendances ?? (lesson.attendances as Attendance[] | undefined)
            );
        }

        return resolveStatusLabel(value, startDatetime, attendances);
    }
}

/**
 * Pure resolver – also exported so other code can call it without the pipe.
 *
 * Priority:
 *  1. CANCELLED                    → "Aula Cancelada"
 *  2. Future startDatetime          → "Aula Prevista"   (unless completed/cancelled/taught)
 *  3. POSTPONED / RESCHEDULED       → "Aula Reagendada"
 *  4. TAUGHT                        → "Aula Lecionada"
 *  5. NOT_TAUGHT / OVERDUE(legacy)  → "Aula Não Lecionada" or "Aula sem Presença"
 *  6. COMPLETED                     → "Aula Lecionada"  or  "Aula sem Presença"
 *  7. AVAILABLE                     → "Disponível"
 *  8. BOOKED / SCHEDULED            → "Agendada"
 */
export function resolveStatusLabel(
    status: string,
    startDatetime?: string | Date,
    attendances?: Attendance[]
): string {
    if (status === LessonStatus.CANCELLED) return 'Aula Cancelada';

    const completedLike = status === LessonStatus.COMPLETED
        || status === LessonStatus.TAUGHT
        || status === LessonStatus.NOT_TAUGHT
        || status === LessonStatus.OVERDUE;

    if (startDatetime && isFuture(startDatetime) && !completedLike) {
        return 'Aula Prevista';
    }

    if (status === LessonStatus.POSTPONED || status === LessonStatus.RESCHEDULED || status === LessonStatus.RESCHEDULE) {
        return 'Aula Reagendada';
    }

    // TAUGHT → explicitly marked as taught
    if (status === LessonStatus.TAUGHT) return 'Aula Lecionada';

    // NOT_TAUGHT / OVERDUE (legacy, migrated to NOT_TAUGHT on deploy)
    if (status === LessonStatus.NOT_TAUGHT || status === LessonStatus.OVERDUE) {
        if (attendances && attendances.length > 0) {
            return attendances.some(a => a.present) ? 'Aula Lecionada' : 'Aula sem Presença';
        }
        return 'Aula Não Lecionada';
    }

    // COMPLETED – derives label from attendance when available
    if (status === LessonStatus.COMPLETED) {
        if (attendances && attendances.length > 0) {
            return attendances.some(a => a.present) ? 'Aula Lecionada' : 'Aula sem Presença';
        }
        return 'Aula Lecionada';
    }

    switch (status) {
        case LessonStatus.AVAILABLE:  return 'Disponível';
        case LessonStatus.BOOKED:     return 'Agendada';
        case LessonStatus.SCHEDULED:  return 'Agendada';
        default:                      return 'Disponível';
    }
}

function isFuture(value: string | Date): boolean {
    const d = value instanceof Date ? value : new Date(value);
    return d > new Date();
}
