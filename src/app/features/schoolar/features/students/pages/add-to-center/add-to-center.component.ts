import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Store} from '@ngrx/store';
import {Student} from 'src/app/core/models/academic/student';
import {Center} from 'src/app/core/models/corporate/center';
import {CenterService} from 'src/app/core/services/center.service';
import {StudentService} from 'src/app/core/services/student.service';
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {selectAllStudents} from "../../../../../../core/store/schoolar/students/students.selectors";

@Component({
    selector: 'app-add-to-center',
    templateUrl: './add-to-center.component.html',
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
export class AddToCenterComponent implements OnInit {
    students: Student[] = [];
    centers: Center[] = [];
    selectedStudents: Student[] = [];
    selectedCenter: Center | null = null;
    form: FormGroup;
    loading = false;

    constructor(
        private store: Store,
        private fb: FormBuilder,
        private centerService: CenterService,
        private studentsService: StudentService,
        private messageService: MessageService
    ) {
        this.form = this.fb.group({
            center: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadStudents();
        this.loadCenters();
    }

    loadStudents(): void {
        this.store.dispatch(StudentsActions.loadStudents());
    }

    loadCenters(): void {
        this.centerService.getAllCenters().subscribe(centers => {
            this.centers = centers;
        });
    }

    onSubmit(): void {
        if (this.form.invalid || !this.selectedCenter || this.selectedStudents.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a center and at least one student'
            });
            return;
        }

        this.loading = true;
        const centerName = this.selectedCenter.name;

        // Process each selected student
        const promises = this.selectedStudents.map(student => {
            const updatedStudent = {...student, center: centerName};
            return this.studentsService.updateStudent(updatedStudent);
        });

        Promise.all(promises)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `${this.selectedStudents.length} students added to ${centerName}`
                });
                this.selectedStudents = [];
                this.loadStudents(); // Refresh the general
            })
            .catch(error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to add students to center'
                });
                console.error('Error adding students to center:', error);
            })
            .finally(() => {
                this.loading = false;
            });
    }
}
