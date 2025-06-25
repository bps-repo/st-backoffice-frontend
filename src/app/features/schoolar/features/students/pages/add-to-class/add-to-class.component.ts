import {Component, OnInit, OnDestroy} from '@angular/core';
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
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {selectAllStudents} from "../../../../../../core/store/schoolar/students/students.selectors";
import {StudentState} from "../../../../../../core/store/schoolar/students/student.state";
import {Observable, Subscription} from 'rxjs';
import {ClassService} from "../../../../../../core/services/class.service";

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
export class AddToClassComponent implements OnInit, OnDestroy {
    students$: Observable<Student[]>;
    students: Student[] = [];
    classes: Class[] = [];
    selectedStudents: Student[] = [];
    selectedClass: Class | null = null;
    form: FormGroup;
    loading = false;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private store: Store<StudentState>,
        private fb: FormBuilder,
        private classService: ClassService,
        private messageService: MessageService
    ) {
        this.form = this.fb.group({
            class: [null, Validators.required]
        });
        this.students$ = this.store.select(selectAllStudents);
    }

    ngOnInit(): void {
        this.loadStudents();
        this.loadClasses();

        // Subscribe to students
        this.subscriptions.add(
            this.students$.subscribe(students => {
                this.students = students;
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    loadStudents(): void {
        this.store.dispatch(StudentsActions.loadStudents());
    }

    loadClasses(): void {
        this.classService.getClasses().subscribe(classes => {
            this.classes = classes;
        });
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
        this.selectedStudents.forEach(student => {
            this.store.dispatch(StudentsActions.addStudentToClass({
                studentId: student.id!,
                classId: this.selectedClass!.id
            }));
        });

        // Show success message
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.selectedStudents.length} students being added to ${this.selectedClass.name}`
        });

        // Reset selection and loading state
        this.selectedStudents = [];
        this.loading = false;
    }
}
