import { Message } from '../mocks/message';
import { Role } from './role';
import { Permission } from './permission';

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string; // Legacy role field, kept for backward compatibility
    roles?: Role[]; // New field for multiple roles
    permissions?: Permission[]; // User-specific permissions
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
