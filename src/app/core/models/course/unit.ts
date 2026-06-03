import { Level } from "./level";
import { UnitProgress } from "../academic/unit-progress";
import { Assessment } from "../academic/assessment";
import { Lesson } from "../academic/lesson";

export interface Unit {
    id: string;
    name: string;
    description: string;
    order: number;
    level: Level | null;
    levelId: string;
    orderUnit: number;
    generic: boolean;
    status: 'active' | 'inactive' | 'archived';
    maximumAssessmentAttempt: number;
    createdAt?: string;
    updatedAt?: string;
    unitProgress?: UnitProgress[],
    assessments?: Assessment[],
    lessons?: Lesson[]
}

/** PATCH /units/{id} request body */
export interface UpdateUnitPayload {
    name: string;
    description: string;
    unitOrder: number;
    maximumAssessmentAttempt: number;
}

export function toUpdateUnitPayload(
    unit: Pick<Unit, 'name' | 'description' | 'orderUnit' | 'maximumAssessmentAttempt'>,
): UpdateUnitPayload {
    return {
        name: unit.name,
        description: unit.description,
        unitOrder: unit.orderUnit,
        maximumAssessmentAttempt: unit.maximumAssessmentAttempt,
    };
}
