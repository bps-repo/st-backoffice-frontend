import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Student } from 'src/app/core/models/academic/student';
import { ContractService, } from 'src/app/core/services/contract.service';
import { StudentsActions } from "../../../../../core/store/schoolar/students/students.actions";
import { selectAllStudents } from "../../../../../core/store/schoolar/students/students.selectors";
import { CreateStudentContractRequest } from 'src/app/core/models/corporate/contract';
import { EmployeesActions } from '../../../../../core/store/corporate/employees/employees.actions';
import { selectAllEmployees } from '../../../../../core/store/corporate/employees/employees.selectors';
import { LevelActions } from '../../../../../core/store/schoolar/level/level.actions';
import { selectAllLevels } from '../../../../../core/store/schoolar/level/level.selector';
import { Level } from '../../../../../core/models/course/level';
import { Service } from '../../../../../core/models/course/service';
import { Employee } from '../../../../../core/models/corporate/employee';

@Component({
    selector: 'app-create-contract',
    templateUrl: './create-contract.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DropdownModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        CalendarModule,
        InputTextareaModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class CreateContractComponent implements OnInit {
    students: Student[] = [];
    selectedStudent: Student | null = null;
    employees: Employee[] = [];
    levels: Level[] = [];
    services: Service[] = [];
    contractForm: FormGroup;
    get contractLevels(): FormArray { return this.contractForm.get('contractLevels') as FormArray; }
    loading = false;

    contractTypes = [
        { label: 'Standard', value: 'STANDARD' },
        { label: 'VIP', value: 'VIP' },
        { label: 'Promotional', value: 'PROMOTIONAL' },
        { label: 'Custom', value: 'CUSTOM' }
    ];

    offerTypes = [
        { label: 'None', value: 'NONE' },
        { label: 'Discount', value: 'DISCOUNT' },
        { label: 'Promotion', value: 'PROMOTION' }
    ];

    registrationFeeTypes = [
        { label: 'None', value: 'NONE' },
        { label: 'Standard', value: 'STANDARD' },
        { label: 'Waived', value: 'WAIVED' }
    ];

    statuses = [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Hold', value: 'HOLD' },
        { label: 'Cancelled', value: 'CANCELLED' },
        { label: 'Completed', value: 'COMPLETED' }
    ];

    constructor(
        private store: Store,
        private fb: FormBuilder,
        private messageService: MessageService,
        private contractService: ContractService
    ) {
        this.contractForm = this.fb.group({
            student: [null, Validators.required],
            sellerId: [null, Validators.required],
            startDate: [null, Validators.required],
            discountPercent: [0, [Validators.min(0), Validators.max(100)]],
            contractType: ['STANDARD', Validators.required],
            numberOfInstallments: [1, [Validators.required, Validators.min(1)]],
            notes: [''],
            contractLevels: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.loadStudents();
        this.loadEmployees();
        this.loadLevels();
        this.loadServices();

        // Sync defaults
        this.contractForm.get('student')?.valueChanges.subscribe((val) => {
            this.selectedStudent = val;
        });

        // Initialize with one contract level
        this.addContractLevel();
    }

    loadStudents(): void {
        this.store.dispatch(StudentsActions.loadStudents());
        this.store.select(selectAllStudents).subscribe(students => {
            // Map to simple dropdown model if needed
            this.students = students.map(s => ({
                ...s,
                name: `${s.user.firstname} ${s.user.lastname}`
            } as any));
        });
    }

    loadEmployees(): void {
        this.store.dispatch(EmployeesActions.loadEmployees());
        this.store.select(selectAllEmployees).subscribe(employees => {
            this.employees = employees.map(e => ({
                ...e,
                name: e['user'] ? `${e['user']['firstname'] || ''} ${e['user']['lastname'] || ''}`.trim() : 'Unknown',
                displayName: e['user'] ? `${e['user']['firstname'] || ''} ${e['user']['lastname'] || ''}`.trim() + ` (${e['user']['email'] || ''})` : 'Unknown'
            } as any));
        });
    }

    loadLevels(): void {
        this.store.dispatch(LevelActions.loadLevels());
        this.store.select(selectAllLevels).subscribe(levels => {
            this.levels = levels;
        });
    }

    loadServices(): void {
        this.services = [
            { id: '1', name: 'English Course Level 1', description: 'Basic English Course', value: 2500, active: true, type: 'REGULAR_COURSE' },
            { id: '2', name: 'English Course Level 2', description: 'Intermediate English Course', value: 2500, active: true, type: 'REGULAR_COURSE' },
            { id: '3', name: 'English Course Level 3', description: 'Advanced English Course', value: 2500, active: true, type: 'REGULAR_COURSE' },
            { id: '4', name: 'Intensive Course', description: 'Intensive English Course', value: 3000, active: true, type: 'INTENSIVE_COURSE' },
            { id: '5', name: 'Private Lessons', description: 'One-on-one English lessons', value: 2000, active: true, type: 'PRIVATE_LESSONS' },
            { id: '6', name: 'Exam Preparation', description: 'TOEFL/IELTS preparation course', value: 3500, active: true, type: 'EXAM_PREPARATION' }
        ];
    }

    private createContractLevelGroup() {
        return this.fb.group({
            levelId: [null, Validators.required],
            productId: [null, Validators.required],
            duration: [1, [Validators.required, Validators.min(1)]],
            levelPrice: [0, [Validators.required, Validators.min(0)]],
            courseMaterialPrice: [0, [Validators.required, Validators.min(0)]],
            levelOrder: [1, [Validators.required, Validators.min(1)]],
            offerType: ['NONE', Validators.required],
            registrationFeeType: ['NONE', Validators.required],
            courseMaterialPaid: [false],
            includeCourseMaterial: [true],
            includeRegistrationFee: [true],
            status: ['ACTIVE', Validators.required],
            contractType: ['STANDARD', Validators.required],
            notes: ['']
        });
    }

    addContractLevel() {
        const levelOrder = this.contractLevels.length + 1;
        const levelGroup = this.createContractLevelGroup();
        levelGroup.patchValue({ levelOrder });
        this.contractLevels.push(levelGroup);
    }

    removeContractLevel(index: number) {
        if (this.contractLevels.length <= 1) return;
        this.contractLevels.removeAt(index);
        // Update level orders
        this.contractLevels.controls.forEach((control, i) => {
            (control as FormGroup).patchValue({ levelOrder: i + 1 });
        });
    }

    onSubmit(): void {
        if (this.contractForm.invalid || !this.selectedStudent) {
            this.contractForm.markAllAsTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields'
            });
            return;
        }

        this.loading = true;

        // Build payload according to new backend schema
        const v = this.contractForm.value;
        const payload: CreateStudentContractRequest = {
            studentId: this.selectedStudent.id!,
            sellerId: v.sellerId,
            startDate: this.formatDate(v.startDate),
            discountPercent: v.discountPercent ?? 0,
            contractLevels: v.contractLevels || [],
            notes: v.notes,
            contractType: v.contractType,
            numberOfInstallments: v.numberOfInstallments
        };

        this.contractService.createStudentContract(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Contract created for ${this.selectedStudent!.user.firstname}`
                });
                this.contractForm.reset();
                this.selectedStudent = null;
                this.contractLevels.clear();
                this.addContractLevel();
                this.loading = false;
            },
            error: (err) => {
                const detail = err?.error?.message || err?.message || 'Failed to create contract.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail });
                this.loading = false;
            }
        });
    }

    private formatDate(date: Date): string {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    }
}
