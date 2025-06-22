import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Student} from "../../../models/academic/student";

export interface StudentsState extends EntityState<Student> {
    students: Student[];
    loading: boolean;
    error: string | null;
}

export const studentsAdapter: EntityAdapter<Student> = createEntityAdapter<Student>({
    selectId: (student: Student) => student.id!,
    sortComparer: false
});

// Initial state
export const initialState: StudentsState = studentsAdapter.getInitialState({
    students: [],
    loading: false,
    error: null,
});
