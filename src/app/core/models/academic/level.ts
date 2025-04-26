import {Service} from "../corporate/service";
import {Unit} from "./unit";
import {Class} from "./class";

export interface Level {
    id: string;
    name: string;
    description: string;
    duration: number;
    maximumUnits: number;
    course: Service;
    units: Unit[];
    classes: Class[];
    createdAt: string;
    updatedAt: string;
}
