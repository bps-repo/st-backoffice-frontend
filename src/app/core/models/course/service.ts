export interface Service {
    id: string;
    name: string;
    description: string;
    value: number;
    active: boolean;
    type: 'REGULAR_COURSE' | 'INTENSIVE_COURSE' | 'PRIVATE_LESSONS' | 'WORKSHOP' | 'EXAM_PREPARATION';
    createdAt?: string;
    updatedAt?: string;
}
