export interface Permission {
    id: string;
    name: string;
    key: string;
    description: string;
    children?: Permission[];
    createdAt: Date;
    updatedAt: Date;
}
