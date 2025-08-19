import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Store} from '@ngrx/store';
import {Student} from 'src/app/core/models/academic/student';
import {Contract} from 'src/app/core/models/corporate/contract';
import {StudentService} from 'src/app/core/services/student.service';
import {ContractService, CreateStudentContractRequest} from 'src/app/core/services/contract.service';
import {StudentsActions} from "../../../../../core/store/schoolar/students/students.actions";
import {selectAllStudents} from "../../../../../core/store/schoolar/students/students.selectors";

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
    contractForm: FormGroup;
    get customInstallments(): FormArray { return this.contractForm.get('customInstallments') as FormArray; }
    loading = false;

    contractTypes = [
        {label: 'Full Course', value: 'FULL_COURSE'},
        {label: 'Monthly', value: 'MONTHLY'},
        {label: 'Quarterly', value: 'QUARTERLY'},
        {label: 'Annual', value: 'ANNUAL'}
    ];

    paymentFrequencies = [
        {label: 'Monthly', value: 'MONTHLY'},
        {label: 'Quarterly', value: 'QUARTERLY'},
        {label: 'Semi-Annual', value: 'SEMI_ANNUAL'},
        {label: 'Annual', value: 'ANNUAL'},
        {label: 'One-time', value: 'ONE_TIME'}
    ];

    statuses = [
        {label: 'Active', value: 'ACTIVE'},
        {label: 'Pending', value: 'PENDING'},
        {label: 'Expired', value: 'EXPIRED'},
        {label: 'Cancelled', value: 'CANCELLED'}
    ];

    constructor(
        private store: Store,
        private fb: FormBuilder,
        private studentsService: StudentService,
        private messageService: MessageService,
        private contractService: ContractService
    ) {
        this.contractForm = this.fb.group({
            student: [null, Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            // UI fields
            contractType: [null, Validators.required],
            paymentFrequency: [null, Validators.required],
            paymentAmount: [null, [Validators.required, Validators.min(0)]],
            status: ['ACTIVE', Validators.required],
            terms: ['', Validators.required],
            // Schema fields
            sellerId: ['', Validators.required],
            amount: [0, [Validators.required, Validators.min(0)]],
            discountPercent: [0, [Validators.min(0), Validators.max(100)]],
            includeManuals: [true],
            includeRegistrationFee: [true],
            adultEnglishCourseProductId: ['', Validators.required],
            levelId: ['', Validators.required],
            courseBookId: ['', Validators.required],
            courseMaterialPaidSameDay: [true],
            unitPrice: [0, [Validators.required, Validators.min(0)]],
            notes: [''],
            schemaContractType: ['STANDARD', Validators.required],
            numberOfInstallments: [1, [Validators.required, Validators.min(1)]],
            firstInstallmentDate: [null, Validators.required],
            autoDistribute: [true],
            customInstallments: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.loadStudents();
        // Sync defaults
        this.contractForm.get('student')?.valueChanges.subscribe((val) => {
            this.selectedStudent = val;
            if (val?.levelId) {
                this.contractForm.patchValue({ levelId: val.levelId });
            }
            if (val?.user?.id) {
                // Default seller as the student's associated user if applicable; can be changed by user
                this.contractForm.patchValue({ sellerId: val.user.id });
            }
        });
        this.contractForm.get('startDate')?.valueChanges.subscribe((d) => {
            const first = this.contractForm.get('firstInstallmentDate')?.value;
            if (!first) {
                this.contractForm.patchValue({ firstInstallmentDate: d });
            }
        });
        // Use paymentAmount as default amount/unitPrice if explicit not set
        this.contractForm.get('paymentAmount')?.valueChanges.subscribe((amt) => {
            const toPatch: any = {};
            if (!this.contractForm.get('amount')?.dirty) toPatch.amount = amt || 0;
            if (!this.contractForm.get('unitPrice')?.dirty) toPatch.unitPrice = amt || 0;
            if (Object.keys(toPatch).length) {
                this.contractForm.patchValue(toPatch);
            }
        });
        // Auto-build installments list based on numberOfInstallments when empty
        this.contractForm.get('numberOfInstallments')?.valueChanges.subscribe((n: number) => {
            n = Math.max(1, n || 1);
            while (this.customInstallments.length < n) {
                this.customInstallments.push(this.createInstallmentGroup(this.customInstallments.length + 1));
            }
            while (this.customInstallments.length > n) {
                this.customInstallments.removeAt(this.customInstallments.length - 1);
            }
            if (this.contractForm.get('autoDistribute')?.value) {
                this.regenerateInstallments();
            }
        });
        // React to first installment date changes
        this.contractForm.get('firstInstallmentDate')?.valueChanges.subscribe(() => {
            if (this.contractForm.get('autoDistribute')?.value) {
                this.regenerateInstallments();
            }
        });
        // React to amount changes
        this.contractForm.get('amount')?.valueChanges.subscribe(() => {
            if (this.contractForm.get('autoDistribute')?.value) {
                this.regenerateInstallments();
            }
        });
        // Initialize with one installment
        this.customInstallments.push(this.createInstallmentGroup(1));
        // Set initial data
        setTimeout(() => this.regenerateInstallments(), 0);
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

    private createInstallmentGroup(installmentNumber: number) {
        return this.fb.group({
            installmentNumber: [installmentNumber, [Validators.required, Validators.min(1)]],
            dueDate: [null, Validators.required],
            amount: [0, [Validators.required, Validators.min(0)]],
            status: ['PENDING_PAYMENT', Validators.required]
        });
    }

    addInstallment() {
        this.customInstallments.push(this.createInstallmentGroup(this.customInstallments.length + 1));
        this.contractForm.patchValue({ numberOfInstallments: this.customInstallments.length });
        if (this.contractForm.get('autoDistribute')?.value) this.regenerateInstallments();
    }

    removeInstallment(index: number) {
        if (this.customInstallments.length <= 1) return;
        this.customInstallments.removeAt(index);
        this.contractForm.patchValue({ numberOfInstallments: this.customInstallments.length });
        if (this.contractForm.get('autoDistribute')?.value) this.regenerateInstallments();
    }

    regenerateInstallments(force = false) {
        const n: number = Math.max(1, this.contractForm.get('numberOfInstallments')?.value || 1);
        const total: number = Number(this.contractForm.get('amount')?.value || 0);
        const firstDate: Date = this.contractForm.get('firstInstallmentDate')?.value;
        if (!firstDate || !n) return;

        // Ensure length is correct
        while (this.customInstallments.length < n) {
            this.customInstallments.push(this.createInstallmentGroup(this.customInstallments.length + 1));
        }
        while (this.customInstallments.length > n) {
            this.customInstallments.removeAt(this.customInstallments.length - 1);
        }

        // Distribute amounts equally (round to 2 decimals; adjust last one)
        const base = Math.floor((total / n) * 100) / 100;
        let remaining = Math.round(total * 100) - Math.round(base * 100) * (n - 1);

        for (let i = 0; i < n; i++) {
            const group = this.customInstallments.at(i) as FormGroup;
            const due = this.addMonths(firstDate, i);

            // Only patch if control is not dirty (unless force)
            const amountCtrl = group.get('amount');
            const dateCtrl = group.get('dueDate');
            const numberCtrl = group.get('installmentNumber');

            if (force || !numberCtrl?.dirty) numberCtrl?.patchValue(i + 1, { emitEvent: false });
            if (force || !dateCtrl?.dirty) dateCtrl?.patchValue(due, { emitEvent: false });
            if (force || !amountCtrl?.dirty) {
                const cents = (i === n - 1) ? remaining : Math.round(base * 100);
                amountCtrl?.patchValue(cents / 100, { emitEvent: false });
                if (i !== n - 1) {
                    remaining -= Math.round(base * 100);
                }
            }
        }
    }

    private addMonths(date: Date, months: number): Date {
        const d = new Date(date);
        const day = d.getDate();
        d.setMonth(d.getMonth() + months);
        // Handle month overflow (e.g., Jan 31 -> Feb 28/29)
        if (d.getDate() < day) {
            d.setDate(0);
        }
        return d;
    }

    get installmentsTotal(): number {
        return (this.contractForm.get('customInstallments') as FormArray).controls
            .map(c => Number((c as FormGroup).get('amount')?.value || 0))
            .reduce((a, b) => a + b, 0);
    }

    onSubmit(): void {
        if (this.contractForm.invalid || !this.selectedStudent) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields'
            });
            return;
        }

        this.loading = true;

        // Validate installments length
        const num = this.contractForm.get('numberOfInstallments')?.value || 0;
        if (this.customInstallments.length !== num) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'O número de parcelas não corresponde aos itens listados.' });
        }

        // Create contract object
        const contract: Contract = {
            studentId: this.selectedStudent.id!.toString(),
            startDate: this.formatDate(this.contractForm.value.startDate),
            endDate: this.formatDate(this.contractForm.value.endDate),
            contractType: this.contractForm.value.contractType,
            paymentFrequency: this.contractForm.value.paymentFrequency,
            paymentAmount: this.contractForm.value.paymentAmount,
            status: this.contractForm.value.status,
            terms: this.contractForm.value.terms,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Build payload according to backend schema using form values
        const v = this.contractForm.value;
        const payload: CreateStudentContractRequest = {
            studentId: this.selectedStudent.id!,
            sellerId: v.sellerId,
            startDate: this.formatDate(v.startDate),
            endDate: this.formatDate(v.endDate),
            amount: v.amount,
            discountPercent: v.discountPercent ?? 0,
            includeManuals: !!v.includeManuals,
            includeRegistrationFee: !!v.includeRegistrationFee,
            adultEnglishCourseProductId: v.adultEnglishCourseProductId,
            levelId: v.levelId,
            courseBookId: v.courseBookId,
            courseMaterialPaidSameDay: !!v.courseMaterialPaidSameDay,
            unitPrice: v.unitPrice,
            notes: v.notes || v.terms,
            contractType: v.schemaContractType,
            numberOfInstallments: v.numberOfInstallments,
            firstInstallmentDate: this.formatDate(v.firstInstallmentDate),
            customInstallments: (v.customInstallments || []).map((ci: any) => ({
                installmentNumber: ci.installmentNumber,
                dueDate: this.formatDate(ci.dueDate),
                amount: ci.amount,
                status: ci.status
            }))
        };

        this.contractService.createStudentContract(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `Contrato criado para ${this.selectedStudent!.user.firstname}`
                });
                this.contractForm.reset({ status: 'ACTIVE' });
                this.selectedStudent = null;
                this.loading = false;
            },
            error: (err) => {
                const detail = err?.error?.message || err?.message || 'Falha ao criar o contrato.';
                this.messageService.add({ severity: 'error', summary: 'Erro', detail });
                this.loading = false;
            }
        });
    }

    private formatDate(date: Date): string {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    }
}
