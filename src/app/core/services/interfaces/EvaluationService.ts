import {Evaluation} from "../../models/academic/evaluation";
import {EvaluationDetail} from "../../models/academic/evaluation-detail";

export interface EvaluationService {
    createEvaluation(
        studentId: string,
        assessmentId: string,
        teacherId: string,
        evaluationDate: string,
        finalGrade: number,
        comments: string,
        approved: boolean
    ): Promise<Evaluation>;

    findByStudentId(studentId: string): Promise<Evaluation[]>;

    findByAssessmentId(assessmentId: string): Promise<Evaluation[]>;

    findByTeacherId(teacherId: string): Promise<Evaluation[]>;

    findByApproved(approved: boolean): Promise<Evaluation[]>;

    findByEvaluationDateBetween(
        startDate: string,
        endDate: string
    ): Promise<Evaluation[]>;

    findByStudentIdAndAssessmentId(
        studentId: string,
        assessmentId: string
    ): Promise<Evaluation[]>;

    updateFinalGrade(
        evaluationId: string,
        finalGrade: number
    ): Promise<Evaluation>;

    updateComments(
        evaluationId: string,
        comments: string
    ): Promise<Evaluation>;

    updateApprovalStatus(
        evaluationId: string,
        approved: boolean
    ): Promise<Evaluation>;

    getEvaluationDetailsForEvaluation(
        evaluationId: string
    ): Promise<Set<EvaluationDetail>>;

    addEvaluationDetail(
        evaluationId: string,
        evaluationDetail: EvaluationDetail
    ): Promise<Evaluation>;

    removeEvaluationDetail(
        evaluationId: string,
        evaluationDetailId: string
    ): Promise<Evaluation>;

    getAverageGradeForAssessment(assessmentId: string): Promise<number>;

    getAverageGradeForStudent(studentId: string): Promise<number>;

    getPassRateForAssessment(assessmentId: string): Promise<number>;
}
