import {Role} from "../auth/role";
import {Gender} from "../../enums/gender";
import {Status} from "../../enums/status";
import {User} from "../user.model";

export interface Employee {
    id: string;
    user: User;
    centerId: string
    hireDate: string;
    resignationDate: string;
    status: EmployeeStatus;
    wage: number;
    roles: Role[];
    createdAt: string;
    updatedAt: string;
}


export interface CreateEmployee {
    user: {
        firstname: string,
        lastname: string,
        gender: Gender,
        email: string,
        password: string,
        dateOfBirth: string,
        photo: string
    },
    role: string,
    centerId: string,
    hiringDate: string,
    wage: number,
    status: Status
}


export type EmployeeStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'ON_LEAVE'
    | 'TERMINATED';
