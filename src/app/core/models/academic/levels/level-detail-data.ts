import {UnitProgress} from "../unit-progress";
import {Student} from "../students/student";
import {Level} from "../../course/level";
import {Unit} from "../../course/unit";

export interface LevelDetailData {
    level: Level;
    units: Unit[];
    students: Student[];
    unitProgresses: UnitProgress[];
    statistics: {
        totalStudents: number;
        totalUnits: number;
        totalTopics: number;
        totalHours: number;
        averageProgress: number;
        progressStats: {
            completed: number;
            inProgress: number;
            notStarted: number;
        };
    };
}

export interface LevelDetailCache {
    data: LevelDetailData;
    timestamp: number;
    isExpired: boolean;
}
