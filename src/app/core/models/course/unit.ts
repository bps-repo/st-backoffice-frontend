import {Level} from "./level";

export interface Unit {
    id: string;
    name: string;
    description: string;
    level: Level | null;
    levelId: string;
    orderUnit: number;
    maximumAssessmentAttempt: number;
    createdAt?: string;
    updatedAt?: string;
}
