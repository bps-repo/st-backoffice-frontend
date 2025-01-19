export interface Class {
    name: string;
    teacher: string;
    timetable: string;
    level: string;
    start_at: string;
    end_at: string;
    description: string;
    status: 'active' | 'inactive';
}
