import {Assessment} from "../../models/academic/assessment";
import {Unit} from "../../models/course/unit";
import {Class} from "../../models/academic/class";
import {UnitProgress} from "../../models/academic/unit-progress";
import {Material} from "../../models/academic/material";

export interface UnitService {
    findByLevelId(levelId: string): Promise<Unit[]>;

    findByLevelIdOrdered(levelId: string): Promise<Unit[]>;

    findByNameAndLevelId(name: string, levelId: string): Promise<Partial<Unit>>;

    createUnit(
        name: string,
        description: string,
        levelId: string,
        order: number,
        maximumAssessmentAttempt: number
    ): Promise<Unit>;

    updateUnitOrder(unitId: string, order: number): Promise<Unit>;

    updateMaximumAssessmentAttempt(
        unitId: string,
        maximumAssessmentAttempt: number
    ): Promise<Unit>;

    getAssessmentsForUnit(unitId: string): Promise<Assessment[]>;

    getClassesForUnit(unitId: string): Promise<Class[]>;

    getUnitProgressForUnit(unitId: string): Promise<UnitProgress[]>;

    getMaterialsForUnit(unitId: string): Promise<Material[]>;

    addMaterialToUnit(unitId: string, materialId: string): Promise<Unit>;

    removeMaterialFromUnit(unitId: string, materialId: string): Promise<Unit>;
}
