import {Student} from "./student";

export interface StudentHistory {
    id: string;
    eventDate: string;
    eventType: EventType;
    description: string;
    student: Student;
    createdAt: string;
    updatedAt: string;
}


export type EventType = 'ENROLLMENT' | 'GRADUATION' | 'WITHDRAWAL' | 'TRANSFER' | string; // Adjust based on your enum
