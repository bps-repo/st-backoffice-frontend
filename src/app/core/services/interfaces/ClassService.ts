import {Class} from "../../models/academic/class";
import {ClassStatus} from "../../enums/class-status";
import {Student} from "../../models/academic/student";
import {Lesson} from "../../models/academic/lesson";

export interface ClassService {
    findByCenterId(centerId: string): Promise<Class[]>;

    findByTeacherId(teacherId: string): Promise<Class[]>;

    findByLevelId(levelId: string): Promise<Class[]>;

    findByUnitId(unitId: string): Promise<Class[]>;

    findByStatus(status: ClassStatus): Promise<Class[]>;

    findByDateRange(startDate: string, endDate: string): Promise<Class[]>;

    findByStudentId(studentId: string): Promise<Class[]>;

    createClass(
        name: string,
        startDate: string,
        endDate: string,
        levelId: string,
        teacherId: string,
        centerId: string,
        unitId: string,
        maxCapacity: number,
        status: ClassStatus
    ): Promise<Class>;

    updateClassStatus(classId: string, status: ClassStatus): Promise<Class>;

    assignTeacherToClass(classId: string, teacherId: string): Promise<Class>;

    addStudentToClass(classId: string, studentId: string): Promise<Class>;

    removeStudentFromClass(classId: string, studentId: string): Promise<Class>;

    getStudentsInClass(classId: string): Promise<Student[]>;

    addLessonToClass(classId: string, lesson: Lesson): Promise<Class>;

    removeLessonFromClass(classId: string, lessonId: string): Promise<Class>;

    getLessonsForClass(classId: string): Promise<Lesson[]>;
}
