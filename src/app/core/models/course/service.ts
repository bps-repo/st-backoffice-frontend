import { ServiceAudienceType } from '../../enums/service-audience-type';
import { ServiceCategory } from '../../enums/service-category';

export interface Service {
    id: string;
    name: string;
    description: string;
    value: number;
    active: boolean;
    category: ServiceCategory;
    type: ServiceAudienceType;
    code?: string;
    providerName?: string;
    hasStock: boolean;
    minimumStock?: number;
    currentStock?: number;
    createdAt?: string;
    updatedAt?: string;
    deleted?: boolean;
}

export interface ServicePayload {
    name: string;
    description: string;
    value: number;
    active: boolean;
    category: ServiceCategory;
    type: ServiceAudienceType;
    code?: string;
    providerName?: string;
    hasStock: boolean;
    minimumStock: number;
    currentStock: number;
}
