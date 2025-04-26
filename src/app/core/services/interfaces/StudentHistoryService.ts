import {EventType, StudentHistory} from "../../models/academic/student-history";

export interface StudentHistoryService {
    createStudentHistory(
        studentId: string,
        eventDate: Date,
        eventType: EventType,
        description: string
    ): Promise<StudentHistory>;

    findByStudentId(studentId: string): Promise<StudentHistory[]>;

    findByEventType(eventType: EventType): Promise<StudentHistory[]>;

    findByEventDateBetween(
        startDate: Date,
        endDate: Date
    ): Promise<StudentHistory[]>;

    findByStudentIdAndEventType(
        studentId: string,
        eventType: EventType
    ): Promise<StudentHistory[]>;

    findByStudentIdAndEventDateBetween(
        studentId: string,
        startDate: Date,
        endDate: Date
    ): Promise<StudentHistory[]>;

    updateDescription(
        studentHistoryId: string,
        description: string
    ): Promise<StudentHistory>;

    getMostRecentHistoryForStudent(studentId: string): Promise<StudentHistory>;

    getMostRecentHistoryForStudentAndEventType(
        studentId: string,
        eventType: EventType
    ): Promise<StudentHistory>;

    countByStudentId(studentId: string): Promise<number>;

    countByEventType(eventType: EventType): Promise<number>;
}
