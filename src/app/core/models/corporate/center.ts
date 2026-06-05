export interface Center {
    id: string;
    name: string;
    email?: string;
    phone: string;
    municipalityId?: string;
    municipality?: string;
    address?: string;
    city?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCenter {
    name: string;
    municipalityId: string;
    phone: string;
    email?: string;
}

export interface UpdateCenter {
    name: string;
    address: string;
    municipalityId: string;
    phone: string;
    active: boolean;
    email?: string;
}
