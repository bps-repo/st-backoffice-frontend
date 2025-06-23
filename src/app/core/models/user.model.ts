export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    photo?: string;
    roleName: string;
    dateOfBirth: string;
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
