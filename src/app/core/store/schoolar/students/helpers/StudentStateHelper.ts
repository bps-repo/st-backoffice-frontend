import {createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import {Student} from "../../../../models/academic/student";
import {StudentState} from "../student.state";

export class StudentEntityOperations {
    constructor(private adapter: EntityAdapter<Student>) {
    }

    // Safe entity operations with proper typing
    addStudent(state: StudentState, student: Student): StudentState {
        return this.adapter.addOne(student, {
            ...state,
            loading: false,
            error: null
        });
    }

    updateStudent(state: StudentState, update: { id: string; changes: Partial<Student> }): StudentState {
        return this.adapter.updateOne(update, {
            ...state,
            loadingUpdate: false,
            updateError: null
        });
    }

    removeStudent(state: StudentState, id: string): StudentState {
        return this.adapter.removeOne(id, {
            ...state,
            loadingDelete: false,
            deleteError: null,
            selectedStudentId: state.selectedStudentId === id ? null : state.selectedStudentId
        });
    }

    loadStudents(state: StudentState, students: Student[]): StudentState {
        return this.adapter.setAll(students, {
            ...state,
            loading: false,
            error: null,
            lastFetch: Date.now()
        });
    }

    // Bulk operations
    addMultipleStudents(state: StudentState, students: Student[]): StudentState {
        return this.adapter.addMany(students, {
            ...state,
            bulkOperationInProgress: false,
            error: null
        });
    }

    updateMultipleStudents(state: StudentState, updates: { id: string; changes: Partial<Student> }[]): StudentState {
        return this.adapter.updateMany(updates, {
            ...state,
            bulkOperationInProgress: false,
            updateError: null
        });
    }

    removeMultipleStudents(state: StudentState, ids: string[]): StudentState {
        return this.adapter.removeMany(ids, {
            ...state,
            bulkOperationInProgress: false,
            deleteError: null,
            selectedStudentIds: state.selectedStudentIds.filter(id => !ids.includes(id))
        });
    }
}
