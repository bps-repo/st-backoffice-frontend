
import { User, CreateUserRequest } from "../auth/user";
import { Role } from "../auth/role";
import { Permission } from "../auth/permission";

export interface Employee {
    id: string;
    status: EmployeeStatus;
    user: User;
    centerId: string;
    createdAt: string;
    updatedAt: string;
}

// Enhanced interface for employee details that matches the API response structure
export interface EmployeeDetails {
    id: string;
    createdAt: string;
    updatedAt: string;
    personalInfo: {
        userId: string;
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        phone: string | null;
        identificationNumber: string | null;
        photoUrl: string | null;
        gender: string;
        birthdate: string | null;
        emailVerified: boolean;
        phoneVerified: boolean;
    };
    role: Role;
    allPermissions: Permission[];
    additionalPermissions: Permission[];
    workInfo: {
        centerId: string;
        centerName: string;
        hiringDate: string;
        resignationDate: string | null;
        wage: number;
        status: EmployeeStatus;
    };
    accountStatus: EmployeeStatus;
}

// Interface for employee creation requests that matches the provided structure
export interface CreateEmployeeRequest {
    user: CreateUserRequest;
    role: string; // Role ID
    centerId: string;
    status: EmployeeStatus;
}

export type EmployeeStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'ON_LEAVE'
    | 'TERMINATED';
