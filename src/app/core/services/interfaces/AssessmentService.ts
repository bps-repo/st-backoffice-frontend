import {Assessment} from "../../models/academic/assessment";
import {AssessmentType} from "../../enums/assessment-type";
import {AssessmentStatus} from "../../enums/assessment-status";
import {Evaluation} from "../../models/academic/evaluation";

export interface AssessmentService {
    findByUnitId(unitId: string): Promise<Assessment[]>;

    findByType(type: AssessmentType): Promise<Assessment[]>;

    findByStatus(status: AssessmentStatus): Promise<Assessment[]>;

    createAssessment(
        name: string,
        description: string,
        assessmentType: AssessmentType,
        unitId: string,
        minimumPassingGrade: number,
        status: AssessmentStatus
    ): Promise<Assessment>;

    updateAssessmentStatus(
        assessmentId: string,
        status: AssessmentStatus
    ): Promise<Assessment>;

    updateMinimumPassingGrade(
        assessmentId: string,
        minimumPassingGrade: number
    ): Promise<Assessment>;

    getEvaluationsForAssessment(assessmentId: string): Promise<Evaluation[]>;

    getEvaluationsForAssessmentAndStudent(
        assessmentId: string,
        studentId: string
    ): Promise<Evaluation[]>;
}
