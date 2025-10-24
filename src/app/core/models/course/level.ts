
export interface Level {
    id: string;
    name: string;
    order: number;
    description: string;
    duration: number;
    color: string;
    status: 'active' | 'inactive' | 'archived';
    maximumUnits: number;
    createdAt?: string;
    updatedAt?: string;
}
