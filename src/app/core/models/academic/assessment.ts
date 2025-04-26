import {AssessmentType} from "../../enums/assessment-type";
import {AssessmentStatus} from "../../enums/assessment-status";
import {Unit} from "./unit";
import {Evaluation} from "./evaluation";

export interface Assessment {
    id: string;
    name: string;
    description: string;
    assessmentType: AssessmentType;
    status: AssessmentStatus;
    unit: Unit;
    minimumPassingGrade: number;
    evaluations: Evaluation[];
    createdAt: string;
    updatedAt: string;
}
