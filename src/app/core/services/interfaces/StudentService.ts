import {Student} from "../../models/academic/student";
import {StudentStatus} from "../../enums/student-status";
import {Class} from "../../models/academic/class";
import {Evaluation} from "../../models/academic/evaluation";
import {UnitProgress} from "../../models/academic/unit-progress";
import {StudentHistory} from "../../models/academic/student-history";
import {Contract} from "../../models/corporate/contract";

export interface StudentService {
    createStudent(
        email: string,
        password: string,
        name: string,
        roleId: string,
        enrollmentDate: Date,
        status: StudentStatus,
        centerId: string
    ): Promise<Student>;

    findByCenterId(centerId: string): Promise<Student[]>;

    findByStatus(status: StudentStatus): Promise<Student[]>;

    findByUserEmail(email: string): Promise<Student[]>;

    findByClassId(classId: string): Promise<Student[]>;

    findByUnitProgress(
        unitId: string,
        completionPercentage: number
    ): Promise<Student[]>;

    findByEvaluation(
        assessmentId: string,
        approved: boolean
    ): Promise<Student[]>;

    assignStudentToCenter(studentId: string, centerId: string): Promise<Student>;

    unassignStudentFromCenter(
        studentId: string,
        centerId: string
    ): Promise<Student>;

    updateStudentStatus(studentId: string, status: StudentStatus): Promise<Student>;

    updateStudentEnrollmentDate(
        studentId: string,
        enrollmentDate: string
    ): Promise<Student>;

    updateStudentContract(studentId: string, contractId: string): Promise<Student>;

    updateStudentUnitProgress(
        studentId: string,
        unitProgressId: string
    ): Promise<Student>;

    updateStudentEvaluation(
        studentId: string,
        evaluationId: string
    ): Promise<Student>;

    updateStudentHistory(
        studentId: string,
        historyId: string
    ): Promise<Student>;

    addStudentToClass(studentId: string, classId: string): Promise<Student>;

    removeStudentFromClass(
        studentId: string,
        classId: string
    ): Promise<Student>;

    updateStudentClass(studentId: string, classId: string): Promise<Student>;

    getContractsForStudent(studentId: string): Promise<Contract[]>;

    getHistoriesForStudent(studentId: string): Promise<StudentHistory[]>;

    getUnitProgressesForStudent(studentId: string): Promise<UnitProgress[]>;

    getEvaluationsForStudent(studentId: string): Promise<Evaluation[]>;

    getClassesForStudent(studentId: string): Promise<Class[]>;

    addStudentsToClass(
        studentIds: string[],
        classId: string
    ): Promise<number>;

    removeStudentsFromClass(
        studentIds: string[],
        classId: string
    ): Promise<number>;
}
