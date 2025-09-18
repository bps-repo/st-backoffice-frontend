import { Level } from "../course/level";
import { Center } from "../corporate/center";

export interface AvailableStudent {
    id: string;
    code: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthdate: string;
    currentUnitId: string;
    currentUnitName: string;
    level: Level;
    levelName: string;
    center: Center;
    centerName: string;
}
