import {Lead} from "./lead";

export interface LeadService {
    id: string;
    lead: Lead;
    consultant: any;
    datetime: string;
    notes: string;
    outcome: ServiceOutcome;
    createdAt: string;
    updatedAt: string;
}

export type ServiceOutcome =
    | 'SUCCESSFUL'
    | 'FOLLOW_UP_NEEDED'
    | 'NO_RESPONSE'
    | 'NEGATIVE'
    | 'CONVERTED_TO_STUDENT';
