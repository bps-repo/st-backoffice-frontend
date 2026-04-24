export interface UnitProgressUnit {
    id: string;
    name: string;
    description?: string;
    orderUnit: string;
    levelId: string;
    status: string;
    generic: boolean;
}

export interface StudentUnitProgress {
    id: string;
    unit: UnitProgressUnit;
    completed: boolean;
    assessmentsPassed: number;
    assessmentsFailed: number;
    lessonProgress: number;
    assessmentProgress: number;
    status: string;
}
