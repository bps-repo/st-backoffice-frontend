import {Student} from "./student";
import {Class} from "./class";
import {StudentClassStatus} from "../../enums/student-class-status";


export interface StudentClass {
    id: StudentClassId;
    student: Student;
    clazz: Class;
    entryDate: string;
    exitDate: string | null;
    status: StudentClassStatus;
    createdAt: string;
    updatedAt: string;
}

export interface StudentClassId {
    studentId: string;
    classId: string;
}
