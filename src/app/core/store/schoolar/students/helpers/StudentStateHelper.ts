import {createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import {Student} from "../../../../models/academic/student";
import {StudentsState} from "../students.state";

export class StudentEntityOperations {
    constructor(private adapter: EntityAdapter<Student>) {
    }

    // Safe entity operations with proper typing
    addStudent(state: StudentsState, student: Student): StudentsState {
        return this.adapter.addOne(student, {
            ...state,
            loading: false,
            error: null
        });
    }

    updateStudent(state: StudentsState, update: { id: string; changes: Partial<Student> }): StudentsState {
        return this.adapter.updateOne(update, {
            ...state,
            loadingUpdate: false,
            updateError: null
        });
    }

    removeStudent(state: StudentsState, id: string): StudentsState {
        return this.adapter.removeOne(id, {
            ...state,
            loadingDelete: false,
            deleteError: null,
            selectedStudentId: state.selectedStudentId === id ? null : state.selectedStudentId
        });
    }

    loadStudents(state: StudentsState, students: Student[]): StudentsState {
        return this.adapter.setAll(students, {
            ...state,
            loading: false,
            error: null,
            lastFetch: Date.now()
        });
    }

    // Bulk operations
    addMultipleStudents(state: StudentsState, students: Student[]): StudentsState {
        return this.adapter.addMany(students, {
            ...state,
            bulkOperationInProgress: false,
            error: null
        });
    }

    updateMultipleStudents(state: StudentsState, updates: { id: string; changes: Partial<Student> }[]): StudentsState {
        return this.adapter.updateMany(updates, {
            ...state,
            bulkOperationInProgress: false,
            updateError: null
        });
    }

    removeMultipleStudents(state: StudentsState, ids: string[]): StudentsState {
        return this.adapter.removeMany(ids, {
            ...state,
            bulkOperationInProgress: false,
            deleteError: null,
            selectedStudentIds: state.selectedStudentIds.filter(id => !ids.includes(id))
        });
    }
}
