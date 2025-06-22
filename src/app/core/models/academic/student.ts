import {Unit} from "../course/unit";
import {Class} from "./class";
import {Permission} from "../auth/permission";

export interface Student {
    id?: string;
    name: string;
    center: string;
    course: string;
    level: string;
    phone: number;
    email: string;
    birthdate: string;
    unit?: Unit,
    classEntity?: Class
    permissions?: Permission[];
    createdAt?: string;
    updatedAt?: string;
}
