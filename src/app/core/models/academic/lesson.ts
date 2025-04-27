export interface Lesson {
    id?: string;
    date: string;
    class: string;
    time: string;
    teacher: string;
    center: string;
    level: string;
    unit?: string,
    description: string;
    students: any[];
    status?:any,
    createdAt?: Date,
    updatedAt?: Date
}
