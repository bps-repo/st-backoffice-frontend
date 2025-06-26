import {Level} from "./level";
import {UnitProgress} from "../academic/unit-progress";
import {Assessment} from "../academic/assessment";
import {Lesson} from "../academic/lesson";

export interface Unit {
    id: string;
    name: string;
    description: string;
    order: number;
    level: Level | null;
    levelId: string;
    orderUnit: number;
    status: 'active' | 'inactive' | 'archived';
    maximumAssessmentAttempt: number;
    createdAt?: string;
    updatedAt?: string;
    unitProgress?: UnitProgress[],
    assessments?: Assessment[],
    lessons?: Lesson[]
}
