import {Student} from "./student";
import {Unit} from "../course/unit";
import {Class} from "./class";

export interface UnitProgress {
    id: string;
    student: Student;
    unit: Unit;
    completionPercentage: number;
    completed: boolean;
    lessonProgress: number,
    assessmentsPassed?: number
    assessmentsFailed?: number;
    completionDate: string | null;
    createdAt: string;
    updatedAt: string;
}
