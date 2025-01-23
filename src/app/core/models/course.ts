export interface Course {
    id: number;
    name: string;
    level: string;
    start: Date;
    end: Date;
    status: CourseStatus;
}
export enum CourseStatus {
    ACTIVE = 'ongoing',
    CANCELED = 'canceled',
    FINISHED = 'finished',
}
