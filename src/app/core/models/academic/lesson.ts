import {Center} from "../corporate/center";
import {Student} from "./student";
import {LessonStatus} from "../../enums/lesson-status";
import {Attendance} from "./attendance";
import {Material} from "./material";
import {Class} from "./class";

export interface Lesson {
    id?: string;
    teacher: string;
    level: string;
    unit?: string,
    description: string;
    students: any[];
    title: string;
    online: boolean;
    onlineLink?: string;
    startDatetime: Date;
    endDatetime: Date;
    center?: Center | string;
    classEntity?: Class;
    student?: Student[];
    status: LessonStatus;
    attendances?: Attendance[];
    materials?: Material[];
    createdAt?: Date;
    updatedAt?: Date;
}
