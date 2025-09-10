import { Permission } from './permission';
import { Role } from './role';

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phone: string | null;
    identificationNumber: string | null;
    photoUrl: string | null;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    birthdate: string | null;
    accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
    emailVerified?: boolean;
    phoneVerified?: boolean;
    role: Role;
    additionalPermissions?: Permission[];
    allPermissions?: Permission[];
    status: string;
    roleName?: string;
    roleId: string;
    additionalPermissionIds?: string[];
    permissions?: Permission[];
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
