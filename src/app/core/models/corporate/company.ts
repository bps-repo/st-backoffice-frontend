export interface Company {
    id: string;
    name: string;
    contactEmail: string;
    contactPhone: string;
    registrationNumber: string;
}

export interface CreateCompany {
    name: string;
    contactEmail: string;
    contactPhone: string;
    registrationNumber: string;
}
