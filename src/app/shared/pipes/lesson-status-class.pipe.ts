import { Pipe, PipeTransform } from '@angular/core';
import { Lesson } from '../../core/models/academic/lesson';
import { Attendance } from '../../core/models/academic/attendance';
import { resolveStatusSeverity } from './lesson-status-severity.pipe';

/**
 * Returns a CSS class string to be applied via [styleClass] on <p-tag>
 * or via [ngClass] on any badge element.
 *
 * Only custom severity sentinels ("planned", "rescheduled", "no-attendance")
 * produce a non-empty class; native PrimeNG severities handle their own
 * styling and receive an empty string here.
 *
 * Usage:
 *   <p-tag [severity]="lesson | lessonStatusSeverity"
 *          [styleClass]="lesson | lessonStatusClass"  ...>
 *
 *   <span class="p-badge"
 *         [ngClass]="lesson | lessonStatusClass">
 */
@Pipe({ name: 'lessonStatusClass', standalone: true, pure: true })
export class LessonStatusClassPipe implements PipeTransform {

    transform(
        value: Lesson | string | null | undefined,
        mode: 'status' | 'modality' = 'status',
        startDatetime?: string | Date,
        attendances?: Attendance[]
    ): string {
        if (value == null) return '';

        if (mode === 'modality') return ''; // modality uses native severities only

        let severity: string | undefined;

        if (typeof value === 'object') {
            const lesson = value as Lesson;
            severity = resolveStatusSeverity(
                lesson.status as string,
                lesson.startDatetime,
                attendances ?? (lesson.attendances as Attendance[] | undefined)
            );
        } else {
            severity = resolveStatusSeverity(value, startDatetime, attendances);
        }

        return CUSTOM_CLASS_MAP[severity ?? ''] ?? '';
    }
}

/** Maps custom severity sentinels to CSS class names. */
const CUSTOM_CLASS_MAP: Record<string, string> = {
    'planned':       'lesson-status-planned',
    'rescheduled':   'lesson-status-rescheduled',
    'no-attendance': 'lesson-status-no-attendance',
};
