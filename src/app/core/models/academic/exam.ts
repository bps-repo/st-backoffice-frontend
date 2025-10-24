
export interface Exam {
    id?: string;
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
    // New properties for the assessment detail layout
    type?: string;
    unit?: string;
    createdAt?: string;
    competencies?: string[];
    gradesCount?: number;
    completionRate?: string;
}
