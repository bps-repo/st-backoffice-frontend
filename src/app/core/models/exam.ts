import { Student } from './student';

export interface Exam {
    id: number;
    name: string;
    date: string;
    status: string;
    students: Student[];
    total: number;
    average: number;
    percentage: number;
    grade: string;
    studentsPresent: number;
    studentsNotPresent: number;
    studentsLate: number;
    studentsExcused: number;
    studentsDisciplinaryAction: number;
    studentsTotal: number;
}
