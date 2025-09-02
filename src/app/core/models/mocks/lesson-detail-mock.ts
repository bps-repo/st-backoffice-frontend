import { Lesson } from '../academic/lesson';
import { Student } from '../academic/student';
import { Attendance } from '../academic/attendance';
import { Material } from '../academic/material';
import { LessonStatus } from '../../enums/lesson-status';

export const MOCK_LESSON_DETAIL: Lesson = {
    id: '1',
    title: 'English Conversation A1',
    description: 'Aula de conversação em inglês para iniciantes. Foco em vocabulário básico e expressões do dia a dia.',
    level: 'A1',
    center: 'Centro Principal',
    teacher: 'Prof. Maria Silva',
    teacherId: 'teacher-1',
    startDatetime: new Date('2024-01-15T14:00:00Z').toISOString(),
    endDatetime: new Date('2024-01-15T15:30:00Z').toISOString(),
    status: LessonStatus.BOOKED,
    online: false,
    onlineLink: undefined,
    unit: 'Turma A',
    unitId: 'unit-1',
    centerId: 'center-1',
    materialsIds: ['material-1', 'material-2'],
    assessmentIds: ['assessment-1'],
    createdAt: new Date('2024-01-10T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T13:30:00Z').toISOString()
};

export const MOCK_STUDENTS: Student[] = []

export const MOCK_ATTENDANCES: Attendance[] = []

export const MOCK_MATERIALS: Material[] = []

export const MOCK_LESSON_BOOKINGS = []
