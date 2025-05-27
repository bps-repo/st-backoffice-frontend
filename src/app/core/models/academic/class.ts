import {Level} from "../course/level";
import {Employee} from "./lead-service";
import {Unit} from "../course/unit";
import {Center} from "../corporate/center";
import {Lesson} from "./lesson";
import {Student} from "./student";
import {UnitProgress} from "./unit-progress";
import {ClassStatus} from "../../enums/class-status";

export interface Class {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    level: Level;
    teacher: Employee;
    center: Center;
    status: ClassStatus;
    maxCapacity: number;
    lessons: Lesson[];
    unitProgresses: UnitProgress[];
    students: Student[];
    createdAt: string;
    updatedAt: string;
}
