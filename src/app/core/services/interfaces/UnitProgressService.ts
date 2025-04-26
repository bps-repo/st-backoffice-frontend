import {UnitProgress} from "../../models/academic/unit-progress";

export interface UnitProgressService {
    createUnitProgress(
        studentId: string,
        unitId: string,
        classId: string,
        completionPercentage: number,
        assessmentComplete: boolean,
        completionDate: Date
    ): Promise<UnitProgress>;

    findByStudentId(studentId: string): Promise<UnitProgress[]>;

    findByUnitId(unitId: string): Promise<UnitProgress[]>;

    findByClassId(classId: string): Promise<UnitProgress[]>;

    findByStudentIdAndUnitId(studentId: string, unitId: string): Promise<UnitProgress[]>;

    findByStudentIdAndClassId(studentId: string, classId: string): Promise<UnitProgress[]>;

    findByAssessmentComplete(assessmentComplete: boolean): Promise<UnitProgress[]>;

    findByCompletionDateBetween(
        startDate: Date,
        endDate: Date
    ): Promise<UnitProgress[]>;

    updateCompletionPercentage(
        unitProgressId: string,
        completionPercentage: number
    ): Promise<UnitProgress>;

    updateAssessmentComplete(
        unitProgressId: string,
        assessmentComplete: boolean
    ): Promise<UnitProgress>;

    updateCompletionDate(
        unitProgressId: string,
        completionDate: Date
    ): Promise<UnitProgress>;

    getAverageCompletionPercentageForUnit(unitId: string): Promise<number>;

    getAverageCompletionPercentageForClass(classId: string): Promise<number>;

    getAverageCompletionPercentageForStudent(studentId: string): Promise<number>;
}
