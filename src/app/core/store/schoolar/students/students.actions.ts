import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Student} from 'src/app/core/models/academic/student';
import {Update} from "@ngrx/entity";
import {CreateStudentRequest} from "../../../services/student.service";

export const STUDENT_FEATURE_KEY = 'students';

export const StudentsActions = createActionGroup({
    source: STUDENT_FEATURE_KEY,
    events: {
        // Load students
        'Load Students': emptyProps(),
        'Load Students Success': props<{ students: Student[], pagination: any }>(),
        'Load Students Failure': props<{ error: string }>(),

        // Load student
        'Load Student': props<{ id: string }>(),
        'Load Student Success': props<{ student: Student }>(),
        'Load Student Failure': props<{ error: string }>(),

        // Create student
        'Create Student': props<{ student: Student }>(),
        'Create Student Success': props<{ student: Student }>(),
        'Create Student Failure': props<{ error: string }>(),

        // Create student with request payload
        'Create Student With Request': props<{ request: CreateStudentRequest }>(),
        'Create Student With Request Success': props<{ student: Student }>(),
        'Create Student With Request Failure': props<{ error: string }>(),

        // Update student
        'Update Student': props<{ student: Student }>(),
        'Update Student Success': props<{ student: Student }>(),
        'Update Student Failure': props<{ error: string }>(),

        // Delete student
        'Delete Student': props<{ id: string }>(),
        'Delete Student Success': props<{ id: string }>(),
        'Delete Student Failure': props<{ error: string }>(),

        // Create student photo
        'Create Student Photo': props<{ studentId: string, photoData: FormData }>(),
        'Create Student Photo Success': props<{ response: any }>(),
        'Create Student Photo Failure': props<{ error: string }>(),

        // Add student to class
        'Add Student To Class': props<{ studentId: string, classId: string }>(),
        'Add Student To Class Success': props<{ response: any }>(),
        'Add Student To Class Failure': props<{ error: string }>(),

        // Remove student from class
        'Remove Student From Class': props<{ studentId: string, classId: string }>(),
        'Remove Student From Class Success': props<{ response: any }>(),
        'Remove Student From Class Failure': props<{ error: string }>(),

        // Add student to center
        'Add Student To Center': props<{ studentId: string, centerId: string }>(),
        'Add Student To Center Success': props<{ response: any }>(),
        'Add Student To Center Failure': props<{ error: string }>(),

        // Remove student from center
        'Remove Student From Center': props<{ studentId: string, centerId: string }>(),
        'Remove Student From Center Success': props<{ response: any }>(),
        'Remove Student From Center Failure': props<{ error: string }>(),

        // Bulk operations
        'Bulk Create Students': props<{ students: Student[] }>(),
        'Bulk Create Students Success': props<{ students: Student[] }>(),
        'Bulk Create Students Failure': props<{ error: string }>(),
        'Bulk Update Students': props<{ updates: Update<Student>[] }>(),
        'Bulk Update Students Success': props<{ students: Student[] }>(),
        'Bulk Update Students Failure': props<{ error: string }>(),
        'Bulk Delete Students': props<{ ids: string[] }>(),
        'Bulk Delete Students Success': props<{ ids: string[] }>(),
        'Bulk Delete Students Failure': props<{ error: string }>(),


        // Select All Students
        'Select All Students': props<{ ids: string[] }>(),
        // Deselect All Students
        'Deselect All Students': emptyProps(),

        // Select student
        'Select Student': props<{ id: string }>(),
        'Deselect Student': emptyProps(),

        // Select multiple students
        'Select Multiple Students': props<{ ids: string[] }>(),
        // Deselect multiple students
        'Deselect Multiple Students': emptyProps(),

        // Toggle student selection
        'Toggle Student Selection': props<{ id: string }>(),
        // Toggle all students selection
        'Toggle All Students Selection': emptyProps(),


        // Clear selection
        'Clear Selection': emptyProps(),

        // Set filters
        'Set Filters': props<{ filters: any }>(),
        // Clear filters
        'Clear Filters': emptyProps(),

        'Update Filters': props<{ filters: any }>(),

        // Set pagination
        'Set Pagination': props<{ pagination: any }>(),
        // Clear pagination
        'Clear Pagination': emptyProps(),

        'Update Pagination': props<{ pagination: any }>(),

        // Set sort
        'Set Sort': props<{ sortBy: string, sortDirection: 'asc' | 'desc' }>(),
        // Clear sort
        'Clear Sort': emptyProps(),

        'Update Sort': props<{ sortBy: string, sortDirection: 'asc' | 'desc' }>(),


        // cache management
        'Set Last Fetch': props<{ timestamp: number }>(),
        'Set Cache Expired': props<{ expired: boolean }>(),
        // Refresh cache
        'Refresh Cache': emptyProps(),
        // Clear cache
        'Clear Cache': emptyProps(),


        // Clear error
        'Clear Error': props<{ errorType: string }>(),

        'Clear All Errors': emptyProps(),
    },
});
