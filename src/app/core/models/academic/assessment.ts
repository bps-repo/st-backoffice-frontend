// src/app/core/models/academic/assessment.ts
import { AssessmentType } from '../../enums/assessment-type';
import { AssessmentStatus } from '../../enums/assessment-status';
import { EvaluationType } from '../../enums/evaluation-type';
import { Skill } from './skill';

export interface AssessmentUnit {
    id: string;
    name: string;
    description: string;
    orderUnit: string;
    levelId: string;
    levelName: string;
    status: string;
    generic: boolean;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
}

export interface Assessment {
    id: string;
    title: string;
    description: string;
    assessmentType: AssessmentType;
    evaluationType: EvaluationType;
    status: AssessmentStatus;
    unit: AssessmentUnit;
    passingScore: number;
    startDatetime: string;
    endDatetime: string;
    skills: Skill[];
    evaluatedUnits: AssessmentUnit[];
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
}

export interface CreateAssessmentRequest {
    title: string;
    description: string;
    assessmentType: AssessmentType;
    evaluationType: EvaluationType;
    passingScore: number;
    status: AssessmentStatus;
    startDatetime: string;
    endDatetime: string;
    unitId?: string;
    skillIds: string[];
    evaluatedUnitIds: string[];
}
