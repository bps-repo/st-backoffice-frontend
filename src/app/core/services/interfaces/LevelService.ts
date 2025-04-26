import {Level} from "../../models/academic/level";
import {Unit} from "../../models/academic/unit";
import {Class} from "../../models/academic/class";

export interface LevelService {
    findByName(name: string): Promise<Level | null>;

    findByCourseId(courseId: string): Promise<Level[]>;

    createLevel(
        name: string,
        description: string,
        duration: number,
        maximumUnits: number,
        courseId: string
    ): Promise<Level>;

    updateMaximumUnits(levelId: string, maximumUnits: number): Promise<Level>;

    updateDuration(levelId: string, duration: number): Promise<Level>;

    getUnitsForLevel(levelId: string): Promise<Unit[]>;

    getOrderedUnitsForLevel(levelId: string): Promise<Unit[]>;

    getClassesForLevel(levelId: string): Promise<Class[]>;
}
