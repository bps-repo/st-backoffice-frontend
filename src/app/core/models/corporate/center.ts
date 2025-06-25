export interface Center {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    phone: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface CreateCenter extends Omit<Center, 'id' | 'createdAt' | 'updatedAt'> {
}
