import {Level} from "./level";
import {Assessment} from "./assessment";
import {UnitProgress} from "./unit-progress";
import {Material} from "./material";
import {Class} from "./class";

export interface Unit {
    id: string;
    name: string;
    description: string;
    level: Level;
    order: number;
    maximumAssessmentAttempt: number;
    assessments: Assessment[];
    classes: Class[];
    progresses: UnitProgress[];
    materials: Material[];
    createdAt: string;
    updatedAt: string;
}
