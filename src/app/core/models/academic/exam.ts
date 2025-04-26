import { Student } from './student';

export interface Exam {
    name?: string;
    date?: string;
    status?: string;
    students?: string[];
    teacher?: string;
    class?: string;
    level?: string;
    reading?: string;
    writing?: string;
    listening?: string;
    speaking?: string;
    grammar?: string;
    vocabulary?: string;
    comprehension?: string;
    notes?: string[];
    feedback?: string[];
    average?: number;
}
