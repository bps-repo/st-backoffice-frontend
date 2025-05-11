import {Service} from "./service";

export interface Level {
    id: string;
    name: string;
    description: string;
    duration: number;
    maximumUnits: number;
    course: Service;
    createdAt: string;
    updatedAt: string;
}
