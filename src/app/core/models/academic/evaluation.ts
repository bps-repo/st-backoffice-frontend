import { Student } from "./student";
import { Assessment } from "./assessment";
import { EvaluationDetail } from "./evaluation-detail";
import { Employee } from "../corporate/employee";

export interface Evaluation {
    id: string;
    student: Student;
    assessment: Assessment;
    teacher: Employee;
    details: EvaluationDetail[];
    evaluationDate: string;
    finalGrade: string;
    comments: string;
    approved: boolean;
    createdAt: string;
    updatedAt: string;
}
