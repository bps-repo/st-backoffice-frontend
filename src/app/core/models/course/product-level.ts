import { Unit } from './unit';

export interface ProductLevel {
    id: string;
    name: string;
    description: string;
    duration: number;
    maximumUnits: number;
    order: number;
    productId: string;
    productName: string;
    units: Unit[];
    createdAt?: string;
    updatedAt?: string;
    deleted?: boolean;
}
