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
 *  1. CANCELLED           → "Aula Cancelada"
 *  2. Future startDatetime → "Aula Prevista"   (unless completed/cancelled)
 *  3. POSTPONED           → "Aula Reagendada"
 *  4. COMPLETED/OVERDUE   → "Aula Lecionada"  or  "Aula sem Presença"
 *  5. AVAILABLE           → "Disponível"
 *  6. BOOKED / SCHEDULED  → "Agendada"
 */
export function resolveStatusLabel(
    status: string,
    startDatetime?: string | Date,
    attendances?: Attendance[]
): string {
    if (status === LessonStatus.CANCELLED) return 'Aula Cancelada';

    if (startDatetime && isFuture(startDatetime) && status !== LessonStatus.COMPLETED) {
        return 'Aula Prevista';
    }

    if (status === LessonStatus.POSTPONED) return 'Aula Reagendada';

    if (status === LessonStatus.COMPLETED || status === LessonStatus.OVERDUE) {
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
