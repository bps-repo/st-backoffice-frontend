export interface MaterialRelation {
    id?: string;
    relatedEntityType: string;
    relatedEntityId: string;
    relatedEntityName?: string;
    description: string;
    orderIndex: number;
    isRequired: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}
