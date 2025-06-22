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
import {StudentsActions} from "../../../../../../core/store/schoolar/students/studentsActions";
import {selectAllStudents} from "../../../../../../core/store/schoolar/students/students.selectors";

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
    classes: Partial<Class>[] = [];
    selectedStudents: Student[] = [];
    selectedClass: Class | null = null;
    form: FormGroup;
    loading = false;

    constructor(
        private store: Store,
        private fb: FormBuilder,
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
        this.store.dispatch(StudentsActions.loadStudents());
        this.store.select(selectAllStudents).subscribe(students => {
            this.students = students;
        });
    }

    loadClasses(): void {
        this.classes = [
            {id: '1', name: 'Class 1'},
            {id: '2', name: 'Class 2'},
            {id: '3', name: 'Class 3'}
        ];
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
            this.selectedClass!.id.toString();
            student.id!.toString();
            new Date().toISOString();
            new Date().toISOString();
            // For now, we'll simulate a successful operation
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    // Update the student's classEntity field
                    const updatedStudent = {...student, classEntity: this.selectedClass};
                    //this.studentsService.updateStudent(updatedStudent);
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
