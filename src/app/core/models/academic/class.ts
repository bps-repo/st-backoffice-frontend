import {Level} from "../course/level";
import {Employee} from "./lead-service";
import {Unit} from "../course/unit";
import {Center} from "../corporate/center";
import {Lesson} from "./lesson";
import {Student} from "./student";
import {UnitProgress} from "./unit-progress";
import {ClassStatus} from "../../enums/class-status";
import {LessonStatus} from "../../enums/lesson-status";

export interface Class {
    id: string;
    name: string;
    levelId: Level;
    centerId: string;
    maxCapacity: number;
    status: ClassStatus;
    createdAt: string;
    updatedAt: string;
}

