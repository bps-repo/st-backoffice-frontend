export interface Permission {
    id: string;
    name: string;
    description: string;
    children?: Permission[];
    createdAt: Date;
    updatedAt: Date;
}
