import {Role} from "../auth/role";

export interface Employee {
    id: string;
    userId: string;
    hireDate: string;
    resignationDate: string;
    status: EmployeeStatus;
    wage: number;
    roles: Role[];
    createdAt: string;
    updatedAt: string;
}


export type EmployeeStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'ON_LEAVE'
    | 'TERMINATED';
