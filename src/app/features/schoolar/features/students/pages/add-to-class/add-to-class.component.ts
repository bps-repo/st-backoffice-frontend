import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Store} from '@ngrx/store';
import {Student} from 'src/app/core/models/academic/student';
import {Class} from 'src/app/core/models/academic/class';
import {StudentsService} from 'src/app/core/services/students.service';
import {selectAllStudents} from 'src/app/core/store/schoolar/reducers/students.reducers';
import {studentsActions} from 'src/app/core/store/schoolar/actions/students.actions';
import {StudentClass} from 'src/app/core/models/academic/student-class';
import {StudentClassStatus} from "../../../../../../core/enums/student-class-status";

@Component({
    selector: 'app-add-to-class',
    templateUrl: './add-to-class.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DropdownModule,
        TableModule,
        InputTextModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class AddToClassComponent implements OnInit {
    students: Student[] = [];
    classes: Class[] = [];
    selectedStudents: Student[] = [];
    selectedClass: Class | null = null;
    form: FormGroup;
    loading = false;

    constructor(
        private store: Store,
        private fb: FormBuilder,
        private studentsService: StudentsService,
        private messageService: MessageService
    ) {
        this.form = this.fb.group({
            class: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadStudents();
        this.loadClasses();
    }

    loadStudents(): void {
        this.store.dispatch(studentsActions.loadStudents());
        this.store.select(selectAllStudents).subscribe(students => {
            this.students = students;
        });
    }

    loadClasses(): void {
        // In a real application, this would fetch classes from a service
        // For now, we'll use mock data
        this.classes = [];
    }

    onSubmit(): void {
        if (this.form.invalid || !this.selectedClass || this.selectedStudents.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a class and at least one student'
            });
            return;
        }

        this.loading = true;

        // Process each selected student
        const promises = this.selectedStudents.map(student => {
            // Create a StudentClass object
            const studentClass: StudentClass = {
                id: {
                    classId: this.selectedClass!.id.toString(),
                    studentId: student.id!.toString()
                },
                student: student,
                status: StudentClassStatus.ACTIVE,
                enrollmentDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // In a real application, this would call a service method to add the student to the class
            // For now, we'll simulate a successful operation
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    // Update the student's classEntity field
                    const updatedStudent = {...student, classEntity: this.selectedClass};
                    this.studentsService.updateStudent(updatedStudent);
                    resolve();
                }, 500);
            });
        });

        Promise.all(promises)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `${this.selectedStudents.length} students added to ${this.selectedClass!.name}`
                });
                this.selectedStudents = [];
                this.loadStudents(); // Refresh the list
            })
            .catch(error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to add students to class'
                });
                console.error('Error adding students to class:', error);
            })
            .finally(() => {
                this.loading = false;
            });
    }
}
