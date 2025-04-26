import {Evaluation} from "./evaluation";

export interface EvaluationDetail {
    id: string;
    evaluation: Evaluation;
    skill: Skill;
    grade: number;
    createdAt: string;
    updatedAt: string;
}


export interface Skill {
    id: string;
    name: string;
    description: string;
}
