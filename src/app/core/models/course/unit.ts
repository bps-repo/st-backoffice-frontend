import {Level} from "./level";

export interface Unit {
    id: string;
    name: string;
    description: string;
    level: Level;
    order: number;
    maximumAssessmentAttempt: number;
    createdAt: string;
    updatedAt: string;
}
