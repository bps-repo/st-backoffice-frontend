import {createEntityAdapter} from "@ngrx/entity";
import {Student} from "../../../../models/academic/student";

export const createValidatedStudentAdapter = () => {
    return createEntityAdapter<Student>({
        selectId: (student: Student) => {
            if (!student.id) {
                throw new Error('Student must have an ID');
            }
            return student.id;
        },
        sortComparer: (a: Student, b: Student) => {
            // Validate student data before sorting
            if (!a.user || !b.user) {
                console.warn('Student missing user data');
                return 0;
            }
            return a.user.lastname.localeCompare(b.user.lastname);
        }
    });
};
