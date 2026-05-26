export type ServiceType = 'ADULT_ENGLISH_COURSE' | 'KIDS_ENGLISH_COURSE' | 'GENERAL' | 'ATL';

export interface Service {
    id: string;
    name: string;
    description: string;
    value: number;
    active: boolean;
    type: ServiceType;
    createdAt?: string;
    updatedAt?: string;
    deleted?: boolean;
}

export interface ServicePayload {
    name: string;
    description: string;
    value: number;
    active: boolean;
    type: ServiceType;
}
