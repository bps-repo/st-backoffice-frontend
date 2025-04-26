import {Lesson} from "./lesson";
import {Student} from "./student";

export interface Attendance {
    id: string;
    lesson: Lesson;
    student: Student;
    present: boolean;
    justification: string;
    createdAt: string;
    updatedAt: string;
}
