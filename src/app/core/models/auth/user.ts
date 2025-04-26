import { Message } from '../mocks/message';

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
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
