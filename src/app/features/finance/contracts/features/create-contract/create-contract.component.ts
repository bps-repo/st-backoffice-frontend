import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Student } from 'src/app/core/models/academic/student';
import { ContractService, } from 'src/app/core/services/contract.service';
import { StudentsActions } from "../../../../../core/store/schoolar/students/students.actions";
import { selectAllStudents } from "../../../../../core/store/schoolar/students/students.selectors";
import { CreateStudentContractRequest, Installment } from 'src/app/core/models/corporate/contract';
import { EmployeesActions } from '../../../../../core/store/corporate/employees/employees.actions';
import { selectAllEmployees } from '../../../../../core/store/corporate/employees/employees.selectors';
import { LevelActions } from '../../../../../core/store/schoolar/level/level.actions';
import { selectAllLevels } from '../../../../../core/store/schoolar/level/level.selector';
import { Level } from '../../../../../core/models/course/level';
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
        InputTextModule,
        TableModule,
        InputNumberModule,
        InputTextareaModule,
        ToastModule,
    ],
    providers: [MessageService]
})
export class CreateContractComponent implements OnInit {
    students: Student[] = [];
    selectedStudent: Student | null = null;
    employees: Employee[] = [];
    levels: Level[] = [];
    contractForm: FormGroup;
    loading = false;

    // Contract summary properties
    contractSummary = {
        totalAmount: 0,
        totalLevelPrice: 0,
        totalMaterialPrice: 0,
        totalDiscount: 0,
        finalAmount: 0,
        installmentAmount: 0
    };

    installments: Installment[] = [];

    contractTypes = [
        { label: 'Standard', value: 'STANDARD' },
        { label: 'VIP', value: 'VIP' },
    ];

    constructor(
        private store: Store,
        private fb: FormBuilder,
        private messageService: MessageService,
        private contractService: ContractService
    ) {
        this.contractForm = this.fb.group({
            student: [null, [Validators.required]],
            sellerId: [null, [Validators.required]],
            discountPercent: [0, [Validators.min(0), Validators.max(100)]],
            contractType: ['STANDARD', [Validators.required]],
            numberOfInstallments: [1, [Validators.required, Validators.min(1)]],
            notes: [''],
            // Contract level fields directly in main form
            levelId: [null, [Validators.required]],
            duration: [0, [Validators.required, Validators.min(1)]],
            levelPrice: [0, [Validators.required, Validators.min(0)]],
            courseMaterialPrice: [0, [Validators.required, Validators.min(0)]],
            courseMaterialPaid: [true],
            includeRegistrationFee: [true],
            levelNotes: ['']
        });
    }

    ngOnInit(): void {
        this.loadStudents();
        this.loadEmployees();
        this.loadLevels();

        // Sync defaults
        this.contractForm.get('student')?.valueChanges.subscribe((val) => {
            this.selectedStudent = val;
        });

        // Watch for changes to recalculate summary
        this.contractForm.valueChanges.subscribe(() => {
            setTimeout(() => {
                this.calculateContractSummary();
                this.generateInstallments();
            }, 50);
        });

        // Register change handlers for level fields
        this.registerLevelChangeHandlers();
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
        this.store.dispatch(LevelActions.loadLevels({}));
        this.store.select(selectAllLevels).subscribe(levels => {
            this.levels = levels;
        });
    }

    // Register change handlers for level fields
    private registerLevelChangeHandlers() {
        this.contractForm.get('levelId')?.valueChanges.subscribe(levelId => {
            if (levelId) {
                this.onLevelSelected(levelId);
            }
        });

        this.contractForm.get('levelPrice')?.valueChanges.subscribe(() => {
            setTimeout(() => {
                this.calculateContractSummary();
                this.generateInstallments();
            }, 50);
        });

        this.contractForm.get('courseMaterialPrice')?.valueChanges.subscribe(() => {
            setTimeout(() => {
                this.calculateContractSummary();
                this.generateInstallments();
            }, 50);
        });
    }

    calculateContractSummary(): void {
        const formValue = this.contractForm.value;
        let totalLevelPrice = 0;
        let totalMaterialPrice = 0;


        // Calculate totals from contract level fields
        const levelPrice = Number(formValue.levelPrice) || 0;
        const materialPrice = Number(formValue.courseMaterialPrice) || 0;

        totalLevelPrice += levelPrice;
        totalMaterialPrice += materialPrice;

        const totalAmount = totalLevelPrice + totalMaterialPrice;
        const discountPercent = formValue.discountPercent || 0;
        const totalDiscount = (totalAmount * discountPercent) / 100;
        const finalAmount = totalAmount - totalDiscount;

        const numberOfInstallments = this.contractForm.get('numberOfInstallments')?.value || 1;
        const installmentAmount = finalAmount > 0 && numberOfInstallments > 0 ? finalAmount / numberOfInstallments : 0;

        this.contractSummary = {
            totalAmount,
            totalLevelPrice,
            totalMaterialPrice,
            totalDiscount,
            finalAmount,
            installmentAmount: Math.round(installmentAmount * 100) / 100
        };
    }

    generateInstallments(): void {
        const formValue = this.contractForm.value;
        const numberOfInstallments = formValue.numberOfInstallments || 1;
        const finalAmount = this.contractSummary.finalAmount;

        if (finalAmount <= 0 || numberOfInstallments <= 0) {
            this.installments = [];
            return;
        }

        const installmentAmount = finalAmount / numberOfInstallments;
        const installments: Installment[] = [];
        const baseDate = new Date(); // Use current date as base for installments

        for (let i = 0; i < numberOfInstallments; i++) {
            const dueDate = new Date(baseDate);
            dueDate.setMonth(dueDate.getMonth() + i);

            installments.push({
                id: `temp-${i + 1}`, // Temporary ID for display
                installmentNumber: i + 1,
                dueDate: dueDate.toISOString().split('T')[0],
                amount: Math.round(installmentAmount * 100) / 100, // Round to 2 decimal places
                status: 'PENDING_PAYMENT'
            });
        }

        // Adjust the last installment to account for rounding differences
        if (installments.length > 0) {
            const totalCalculated = installments.reduce((sum, inst) => sum + inst.amount, 0);
            const difference = finalAmount - totalCalculated;
            installments[installments.length - 1].amount += difference;
            installments[installments.length - 1].amount = Math.round(installments[installments.length - 1].amount * 100) / 100;
        }

        this.installments = installments;
    }

    onLevelSelected(levelId: string): void {
        const selectedLevel = this.levels.find(level => level.id === levelId);
        if (selectedLevel) {
            // Auto-populate duration from selected level
            this.contractForm.patchValue({
                duration: selectedLevel.duration
            });

            // Trigger recalculation
            setTimeout(() => {
                this.calculateContractSummary();
                this.generateInstallments();
            }, 100);
        }
    }

    // Manual trigger for debugging
    manualCalculate(): void {
        console.log('Manual calculation triggered');
        this.calculateContractSummary();
        this.generateInstallments();
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
            amount: this.contractSummary.finalAmount || 0,
            enrollmentFee: 0,
            enrollmentFeePaid: true,
            discountPercent: v.discountPercent ?? 0,
            unitPrice: Number(v.levelPrice || 0),
            contractLevel: {
                levelId: v.levelId,
                duration: Number(v.duration || 0),
                levelPrice: Number(v.levelPrice || 0),
                courseMaterialPrice: Number(v.courseMaterialPrice || 0),
                finalCourseMaterialPrice: Number(v.courseMaterialPrice || 0),
                courseMaterialPaid: Boolean(v.courseMaterialPaid),
                includeRegistrationFee: Boolean(v.includeRegistrationFee),
                notes: v.levelNotes
            },
            includeRegistrationFee: Boolean(v.includeRegistrationFee),
            numberOfLevelsOffered: 1,
            notes: v.notes,
            contractType: v.contractType,
            numberOfInstallments: v.numberOfInstallments
        };

        // Add contract summary and installments to payload if needed
        console.log('Contract Summary:', this.contractSummary);
        console.log('Generated Installments:', this.installments);
        console.log('Payload:', payload);

        this.contractService.createStudentContract(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Contract created for ${this.selectedStudent!.user.firstname}`
                });
                this.contractForm.reset();
                this.selectedStudent = null;
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
