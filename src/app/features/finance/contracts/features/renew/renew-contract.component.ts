import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    HostListener,
    OnDestroy
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Store} from '@ngrx/store';
import {Student} from 'src/app/core/models/academic/student';
import {ContractService,} from 'src/app/core/services/contract.service';
import {StudentsActions} from "../../../../../core/store/schoolar/students/students.actions";
import {selectAllStudents} from "../../../../../core/store/schoolar/students/students.selectors";
import {CreateStudentContractRequest, Installment} from 'src/app/core/models/corporate/contract';
import {EmployeesActions} from '../../../../../core/store/corporate/employees/employees.actions';
import {selectAllEmployees} from '../../../../../core/store/corporate/employees/employees.selectors';
import {LevelActions} from '../../../../../core/store/schoolar/level/level.actions';
import {selectAllLevels} from '../../../../../core/store/schoolar/level/level.selector';
import {Level} from '../../../../../core/models/course/level';
import {Employee} from '../../../../../core/models/corporate/employee';
import {CanComponentDeactivate} from "../../../../../core/guards/pending-changes.guard";
import {Observable} from "rxjs";

@Component({
    selector: 'finance-renew-contract',
    templateUrl: './renew-contract.component.html',
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
export class RenewContractComponent implements OnInit, OnChanges, OnDestroy, CanComponentDeactivate {
    @Input() renewContract?: boolean = true;
    @Input() createdStudentId?: string | null = null; // New input for created student
    @Output() contractCompleted = new EventEmitter<void>(); // Emit when contract is created

    // Flag to prevent from closing/reload the browser tab
    unsavedChanges = true;

    students: Student[] = [];
    selectedStudent: Student | null = null;
    employees: Employee[] = [];
    levels: Level[] = [];
    contractForm: FormGroup;
    loading = false;

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
        {label: 'Standard', value: 'STANDARD'},
        {label: 'VIP', value: 'VIP'},
    ];

    constructor(
        private store: Store,
        private fb: FormBuilder,
        private messageService: MessageService,
        private contractService: ContractService
    ) {
        this.contractForm = this.fb.group({
            student: [null, [Validators.required]],
            discountPercent: [0, [Validators.min(0), Validators.max(100)]],
            contractType: ['STANDARD', [Validators.required]],
            numberOfInstallments: [1, [Validators.required, Validators.min(1)]],
            notes: [''],
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
        if (this.renewContract === undefined) {
            this.renewContract = true;
        }

        this.unsavedChanges = true;

        this.loadStudents();
        this.loadEmployees();
        this.loadLevels();

        this.contractForm.get('student')?.valueChanges.subscribe((val) => {
            this.selectedStudent = val;
        });

        this.contractForm.valueChanges.subscribe(() => {
            setTimeout(() => {
                this.calculateContractSummary();
                this.generateInstallments();
            }, 50);
        });

        this.registerLevelChangeHandlers();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // When createdStudentId is provided, auto-select the student
        if (changes['createdStudentId'] && this.createdStudentId) {
            this.selectCreatedStudent();
        }
    }

    canDeactivate(): boolean {
        if (this.contractForm.dirty) {
            return confirm('⚠️ Você tem alterações não salvas. Tens a certeza que desejas sair?');
        }
        return true;
    }

    private selectCreatedStudent(): void {
        // Find the created student in the list
        const student = this.students.find(s => s.id === this.createdStudentId);
        if (student) {
            this.selectedStudent = student;
            this.contractForm.patchValue({student});

            // Disable student selection since it's auto-selected
            this.contractForm.get('student')?.disable();

            this.messageService.add({
                severity: 'info',
                summary: 'Aluno Selecionado',
                detail: `Criando contrato para ${student.user.firstname} ${student.user.lastname}`
            });
        }
    }

    loadStudents(): void {
        this.store.dispatch(StudentsActions.loadStudents());
        this.store.select(selectAllStudents).subscribe(students => {
            this.students = students.map(s => ({
                ...s,
                name: `${s.user.firstname} ${s.user.lastname}`
            } as any));

            // If createdStudentId exists, select it after loading
            if (this.createdStudentId) {
                this.selectCreatedStudent();
            }
        });
    }

    loadEmployees(): void {
        this.store.dispatch(EmployeesActions.loadEmployees());
        this.store.select(selectAllEmployees).subscribe((employees: Employee[]) => {
            this.employees = employees.map(e => ({
                ...e,
                name: e.personalInfo ? `${e.personalInfo.firstName || ''} ${e.personalInfo.lastName || ''}`.trim() : 'Unknown',
                displayName: e.personalInfo ? `${e.personalInfo.firstName || ''} ${e.personalInfo.lastName || ''}`.trim() + ` (${e.personalInfo.email || ''})` : 'Unknown'
            } as any));
        });
    }

    loadLevels(): void {
        this.store.dispatch(LevelActions.loadLevels({}));
        this.store.select(selectAllLevels).subscribe(levels => {
            this.levels = levels;
        });
    }

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
        const formValue = this.contractForm.getRawValue(); // Use getRawValue to get disabled fields
        let totalLevelPrice = 0;
        let totalMaterialPrice = 0;

        const levelPrice = Number(formValue.levelPrice) || 0;
        const materialPrice = Number(formValue.courseMaterialPrice) || 0;

        totalLevelPrice += levelPrice;
        totalMaterialPrice += materialPrice;

        const totalAmount = totalLevelPrice + totalMaterialPrice;
        const discountPercent = formValue.discountPercent || 0;
        const totalDiscount = (totalAmount * discountPercent) / 100;
        const finalAmount = totalAmount - totalDiscount;

        const numberOfInstallments = formValue.numberOfInstallments || 1;
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
        const formValue = this.contractForm.getRawValue();
        const numberOfInstallments = formValue.numberOfInstallments || 1;
        const finalAmount = this.contractSummary.finalAmount;

        if (finalAmount <= 0 || numberOfInstallments <= 0) {
            this.installments = [];
            return;
        }

        const installmentAmount = finalAmount / numberOfInstallments;
        const installments: Installment[] = [];
        const baseDate = new Date();

        for (let i = 0; i < numberOfInstallments; i++) {
            const dueDate = new Date(baseDate);
            dueDate.setMonth(dueDate.getMonth() + i);

            installments.push({
                id: `temp-${i + 1}`,
                installmentNumber: i + 1,
                dueDate: dueDate.toISOString().split('T')[0],
                amount: Math.round(installmentAmount * 100) / 100,
                status: 'PENDING_PAYMENT'
            });
        }

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
            this.contractForm.patchValue({
                duration: selectedLevel.duration
            });

            setTimeout(() => {
                this.calculateContractSummary();
                this.generateInstallments();
            }, 100);
        }
    }

    onSubmit(): void {
        const formValue = this.contractForm.getRawValue(); // Get all values including disabled

        // Validate
        if (!formValue.student || !formValue.levelId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor preencha todos os campos obrigatórios'
            });
            return;
        }

        this.loading = true;

        const payload: CreateStudentContractRequest = {
            studentId: formValue.student.id || this.createdStudentId!,
            sellerId: formValue.sellerId,
            amount: this.contractSummary.finalAmount || 0,
            enrollmentFee: 0,
            enrollmentFeePaid: true,
            discountPercent: formValue.discountPercent ?? 0,
            unitPrice: Number(formValue.levelPrice || 0),
            contractLevel: {
                levelId: formValue.levelId,
                duration: Number(formValue.duration || 0),
                levelPrice: Number(formValue.levelPrice || 0),
                courseMaterialPrice: Number(formValue.courseMaterialPrice || 0),
                finalCourseMaterialPrice: Number(formValue.courseMaterialPrice || 0),
                courseMaterialPaid: Boolean(formValue.courseMaterialPaid),
                includeRegistrationFee: Boolean(formValue.includeRegistrationFee),
                notes: formValue.levelNotes
            },
            includeRegistrationFee: Boolean(formValue.includeRegistrationFee),
            numberOfLevelsOffered: 0,
            notes: formValue.notes,
            contractType: formValue.contractType,
            numberOfInstallments: formValue.numberOfInstallments
        };

        this.contractService.createStudentContract(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Contrato criado com sucesso!'
                });

                // Emit event to parent component
                this.contractCompleted.emit();

                this.unsavedChanges = false;

                this.loading = false;
            },
            error: (err) => {
                const detail = err?.error?.message || err?.message || 'Falha ao criar contrato.';
                this.messageService.add({severity: 'error', summary: 'Erro', detail});
                this.loading = false;
            }
        });
    }

    ngOnDestroy() {
        if (this.unsavedChanges) {

        }
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification(event: BeforeUnloadEvent): void {
        if (this.unsavedChanges) {
            event.preventDefault();
            event.returnValue = '';
        }
    }
}
