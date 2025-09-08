import { Permission } from './permission';

export interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    photo: string;
    birthdate: string;
    dateOfBirth: string; // Added for consistency with the new request structure
    gender: string;
    identificationNumber: string;
    status: string;
    username: string;
    roleName: string;
    roleId: string;
    password?: string; // Added for creation requests
    additionalPermissionIds?: string[]; // Added for additional permissions
    permissions?: Permission[];
    emailVerified: boolean;
    emailVerifiedAt?: Date;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
    resetPasswordToken?: string;
    resetPasswordTokenExpiresAt?: Date;
    refreshToken?: string;
    refreshTokenExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for user creation requests
export interface CreateUserRequest {
    firstname: string;
    lastname: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    password: string;
    additionalPermissionIds?: string[];
    photo?: string;
}
