import {Unit} from "../course/unit";
import {Class} from "./class";

export interface Student {
    id?: number;
    name: string;
    center: string;
    course: string;
    level: string;
    phone: number;
    email: string;
    birthdate: string;
    unit?: Unit,
    classEntity?: Class
    createdAt?: string;
    updatedAt?: string;
}
