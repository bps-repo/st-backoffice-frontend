import {Student} from "./student";
import {Unit} from "../course/unit";
import {Class} from "./class";

export interface UnitProgress {
    id: string;
    student: Student;
    unit: Unit;
    classEntity: Class;
    completionPercentage: number;
    assessmentComplete: boolean;
    completionDate: string | null;
    createdAt: string;
    updatedAt: string;
}
