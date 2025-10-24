export interface LessonUnit {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    description: string;
    orderUnit: string;
    levelId: string;
    status: string | null;
    generic: boolean;
}
