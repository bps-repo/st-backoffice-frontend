export interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    photo?: string;
    roleName: string;
    birthdate: string;
    gender: string;
    identificationNumber?: string;
    status: UserStatus;
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    DELETED = 'DELETED',
    BLOCKED = 'BLOCKED',
}
