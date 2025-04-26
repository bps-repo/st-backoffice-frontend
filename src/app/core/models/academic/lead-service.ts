import {Lead} from "./lead";

export interface LeadService {
    id: string;
    lead: Lead;
    consultant: Employee;
    datetime: string;
    notes: string;
    outcome: ServiceOutcome;
    createdAt: string;
    updatedAt: string;
}


export interface Employee {
    id: string;
    name: string;
}

export type ServiceOutcome =
    | 'SUCCESSFUL'
    | 'FOLLOW_UP_NEEDED'
    | 'NO_RESPONSE'
    | 'NEGATIVE'
    | 'CONVERTED_TO_STUDENT';
