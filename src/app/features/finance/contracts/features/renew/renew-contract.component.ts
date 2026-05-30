import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, HostListener, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Student } from 'src/app/core/models/academic/students/student';
import { ContractService, } from 'src/app/core/services/contract.service';
import { ServiceService } from 'src/app/core/services/service.service';
import { Service } from 'src/app/core/models/course/service';
import { ServiceCategory } from 'src/app/core/enums/service-category';
import { ServiceAudienceType } from 'src/app/core/enums/service-audience-type';
import { ProductLevel } from 'src/app/core/models/course/product-level';
import { StudentsActions } from "../../../../../core/store/schoolar/students/students.actions";
import { selectAllStudents } from "../../../../../core/store/schoolar/students/students.selectors";
import { CreateStudentContractRequest } from 'src/app/core/models/corporate/contract';
import { EmployeesActions } from '../../../../../core/store/corporate/employees/employees.actions';
import { selectAllEmployees } from '../../../../../core/store/corporate/employees/employees.selectors';
import { Employee } from '../../../../../core/models/corporate/employee';
import { CanComponentDeactivate } from "../../../../../core/guards/pending-changes.guard";
import { ShowToastErrorService } from '../../../../../shared/services/show-toast-error-service';
import { Subject } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { CreateInstallment, Installment, InstallmentStatus } from 'src/app/core/models/payment/installment';

@Component({
    selector: 'finance-renew-contract',
    templateUrl: './renew-contract.component.html',
    styleUrls: ['./renew-contract.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CheckboxModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        TableModule,
        TagModule,
        Textarea,
        ToastModule,
        DatePickerModule,
    ],
    providers: [MessageService]
})
export class RenewContractComponent implements OnInit, OnChanges, OnDestroy, CanComponentDeactivate {
    private store = inject(Store);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private contractService = inject(ContractService);
    private serviceService = inject(ServiceService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    @Input() renewContract?: boolean = true;
    @Input() createdStudentId?: string | null = null; // New input for created student (component input)
    @Output() contractCompleted = new EventEmitter<void>(); // Emit when contract is created

    // Flag to prevent from closing/reload the browser tab
    unsavedChanges = true;
    private destroy$ = new Subject<void>();

    students: Student[] = [];
    selectedStudent: Student | null = null;
    employees: Employee[] = [];
    products: Service[] = [];
    materialProducts: Service[] = [];
    productLevels: ProductLevel[] = [];
    loadingLevels = false;
    selectedProduct: Service | null = null;
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

    installments: CreateInstallment[] = [];
    editingInstallmentIndex: number | null = null;
    editingInstallment: CreateInstallment | null = null;

    contractTypes = [
        { label: 'Standard', value: 'STANDARD' },
        { label: 'VIP', value: 'VIP' },
    ];

    constructor() {
        this.contractForm = this.fb.group({
            student: [null, [Validators.required]],
            productId: [null, [Validators.required]],
            materialProductId: [null],
            companyId: [null],
            durationMonths: [null],
            discountPercent: [0, [Validators.min(0), Validators.max(100)]],
            contractType: ['STANDARD', [Validators.required]],
            numberOfInstallments: [1, [Validators.required, Validators.min(1)]],
            notes: [''],
            levelId: [null],
            duration: [0],
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

        // Load createdStudentId from route (priority: route data > queryParams > @Input)
        this.loadCreatedStudentIdFromRoute();

        this.loadStudents();
        this.loadEmployees();
        this.loadProducts();

        this.contractForm.get('student')?.valueChanges.subscribe((val) => {
            this.selectedStudent = val;
        });

        this.contractForm.get('productId')?.valueChanges.subscribe((productId: string | null) => {
            this.onProductChange(productId);
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
        // When createdStudentId is provided via @Input, auto-select the student
        if (changes['createdStudentId'] && this.createdStudentId) {
            this.selectCreatedStudent();
        }
    }

    /**
     * Load createdStudentId from route data or queryParams
     * Priority: route.data.createdStudentId > queryParams.createdStudentId > @Input createdStudentId
     */
    private loadCreatedStudentIdFromRoute(): void {
        // First, try to get from route data
        this.route.data
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
                if (data['createdStudentId']) {
                    this.createdStudentId = data['createdStudentId'];
                    // Select student if data is available
                    if (this.createdStudentId && this.students.length > 0) {
                        this.selectCreatedStudent();
                    }
                }
            });

        // Then, try to get from queryParams if not found in route data
        this.route.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const studentIdFromQuery = params['createdStudentId'] || params['studentId'];

                // Only use queryParams if route data didn't provide it and @Input doesn't have it
                if (studentIdFromQuery && !this.createdStudentId) {
                    this.createdStudentId = studentIdFromQuery;
                }

                // If we have a createdStudentId from any source, select the student
                if (this.createdStudentId && this.students.length > 0) {
                    this.selectCreatedStudent();
                }
            });
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
            this.contractForm.patchValue({ student });

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
        this.store.select(selectAllStudents)
            .pipe(takeUntil(this.destroy$))
            .subscribe(students => {
                this.students = students.map(s => ({
                    ...s,
                    name: `${s.user.firstname} ${s.user.lastname}`
                } as any));

                // If createdStudentId exists from any source (route data, queryParams, or @Input), select it after loading
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

    loadProducts(): void {
        this.serviceService.getServices(0, 200)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
                const all = response.data?.content ?? [];
                this.products = all.filter(p =>
                    p.category !== ServiceCategory.MATERIAL && p.category !== ServiceCategory.GENERAL
                );
                this.materialProducts = all.filter(p => p.category === ServiceCategory.MATERIAL);
            });
    }

    private onProductChange(productId: string | null): void {
        this.selectedProduct = productId ? (this.products.find(p => p.id === productId) ?? null) : null;

        const materialProductId = this.contractForm.get('materialProductId')!;
        const companyId = this.contractForm.get('companyId')!;
        const durationMonths = this.contractForm.get('durationMonths')!;
        const levelId = this.contractForm.get('levelId')!;

        materialProductId.clearValidators();
        companyId.clearValidators();
        durationMonths.clearValidators();
        levelId.clearValidators();

        if (this.selectedProduct) {
            if (this.isCorporate) {
                companyId.setValidators([Validators.required]);
            }

            if (this.isLanguageCourse) {
                materialProductId.setValidators([Validators.required]);
                levelId.setValidators([Validators.required]);
                this.loadingLevels = true;
                this.productLevels = [];
                this.contractForm.patchValue({ levelId: null, duration: 0 }, { emitEvent: false });
                this.serviceService.getServiceLevels(productId!)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (levels) => {
                            this.productLevels = levels;
                            this.loadingLevels = false;
                        },
                        error: () => {
                            this.loadingLevels = false;
                            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar os níveis do produto' });
                        }
                    });
            } else {
                this.productLevels = [];
                this.contractForm.patchValue({ levelId: null, duration: 0 }, { emitEvent: false });
                durationMonths.setValidators([Validators.required, Validators.min(1)]);
            }
        } else {
            this.productLevels = [];
            this.contractForm.patchValue({ levelId: null, duration: 0 }, { emitEvent: false });
        }

        materialProductId.updateValueAndValidity();
        companyId.updateValueAndValidity();
        durationMonths.updateValueAndValidity();
        levelId.updateValueAndValidity();
    }

    get isLanguageCourse(): boolean {
        return this.selectedProduct?.category === ServiceCategory.LANGUAGE_COURSE;
    }

    get isCorporate(): boolean {
        return this.selectedProduct?.type === ServiceAudienceType.CORPORATE;
    }

    get needsDurationMonths(): boolean {
        return !!this.selectedProduct && !this.isLanguageCourse;
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

        // Contract amount includes only the level price (course material is separate)
        const totalAmount = totalLevelPrice;
        const discountPercent = formValue.discountPercent || 0;
        // Discount applies only to the level price
        const totalDiscount = (totalLevelPrice * discountPercent) / 100;
        const finalAmount = totalLevelPrice - totalDiscount;

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
        const installments: CreateInstallment[] = [];
        const baseDate = new Date();

        // Contract duration in months: level duration for language courses, durationMonths otherwise.
        // When not yet configured, fall back to monthly spacing.
        const contractDurationMonths = this.isLanguageCourse
            ? (Number(formValue.duration) || 0)
            : (Number(formValue.durationMonths) || 0);

        const intervalMonths = contractDurationMonths > 0
            ? contractDurationMonths / numberOfInstallments
            : 1;

        for (let i = 0; i < numberOfInstallments; i++) {
            const dueDate = new Date(baseDate);
            const exactOffset = i * intervalMonths;
            const wholeMonths = Math.floor(exactOffset);
            // Remaining fraction converted to days so sub-monthly intervals produce distinct dates
            const remainingDays = Math.round((exactOffset - wholeMonths) * 30);

            dueDate.setMonth(dueDate.getMonth() + wholeMonths);
            if (remainingDays > 0) dueDate.setDate(dueDate.getDate() + remainingDays);

            installments.push({
                installmentNumber: i + 1,
                dueDate: dueDate.toISOString().split('T')[0],
                amount: Math.round(installmentAmount * 100) / 100,
                status: i === 0 ? InstallmentStatus.PAID : InstallmentStatus.PENDING_PAYMENT
            });
        }

        if (installments.length > 0) {
            const totalCalculated = installments.reduce((sum, inst) => sum + inst.amount, 0);
            const difference = finalAmount - totalCalculated;
            installments[installments.length - 1].amount += difference;
            installments[installments.length - 1].amount = Math.round(installments[installments.length - 1].amount * 100) / 100;
        }

        this.installments = installments;
        console.log('Generated Installments:', this.installments);
    }

    onLevelSelected(levelId: string): void {
        const selectedLevel = this.productLevels.find(level => level.id === levelId);
        if (selectedLevel) {
            this.contractForm.patchValue({ duration: selectedLevel.duration });
            setTimeout(() => {
                this.calculateContractSummary();
                this.generateInstallments();
            }, 100);
        }
    }

    startEditInstallment(index: number): void {
        this.editingInstallmentIndex = index;
        // Create a deep copy of the installment for editing
        this.editingInstallment = { ...this.installments[index] };

        // Convert string date to Date object for p-calendar
        if (this.editingInstallment.dueDate) {
            (this.editingInstallment as any).dueDateObj = new Date(this.editingInstallment.dueDate);
        }
        console.log('Editing Installment:', this.editingInstallment);
    }

    saveEditInstallment(): void {
        if (this.editingInstallmentIndex !== null && this.editingInstallment) {
            // Validate amount
            if (!this.editingInstallment.amount || this.editingInstallment.amount <= 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'O valor da parcela deve ser maior que zero'
                });
                return;
            }

            // Convert Date object back to string
            if ((this.editingInstallment as any).dueDateObj) {
                const dateObj = (this.editingInstallment as any).dueDateObj;
                this.editingInstallment.dueDate = dateObj.toISOString().split('T')[0];
            }

            // Update the installment in the array
            this.installments[this.editingInstallmentIndex] = {
                installmentNumber: this.editingInstallment.installmentNumber,
                dueDate: this.editingInstallment.dueDate,
                amount: Math.round(this.editingInstallment.amount * 100) / 100,
                status: this.editingInstallment.status
            };

            // Validate total amounts
            this.validateInstallmentTotals();

            this.cancelEditInstallment();

            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Parcela atualizada com sucesso'
            });
        }
    }

    cancelEditInstallment(): void {
        this.editingInstallmentIndex = null;
        this.editingInstallment = null;
    }

    isEditingInstallment(index: number): boolean {
        return this.editingInstallmentIndex === index;
    }

    validateInstallmentTotals(): void {
        const totalInstallments = this.installments.reduce((sum, inst) => sum + inst.amount, 0);
        const difference = Math.abs(this.contractSummary.finalAmount - totalInstallments);

        // If difference is significant (more than 0.01), show warning
        if (difference > 0.01) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: `A soma das parcelas (${totalInstallments.toFixed(2)} AOA) difere do valor total do contrato (${this.contractSummary.finalAmount.toFixed(2)} AOA). Diferença: ${difference.toFixed(2)} AOA`,
                life: 5000
            });
        }
    }

    getTotalInstallmentsAmount(): number {
        return this.installments.reduce((sum, inst) => sum + inst.amount, 0);
    }

    getInstallmentsDifference(): number {
        const total = this.getTotalInstallmentsAmount();
        const contractAmount = this.contractSummary.finalAmount;
        const difference = contractAmount - total;

        // Round to 2 decimal places to avoid floating point precision issues
        return Math.round(difference * 100) / 100;
    }

    autoAdjustLastInstallment(): void {
        if (this.installments.length === 0) {
            return;
        }

        const difference = this.getInstallmentsDifference();
        const lastIndex = this.installments.length - 1;

        // Add the difference to the last installment
        this.installments[lastIndex].amount += difference;
        this.installments[lastIndex].amount = Math.round(this.installments[lastIndex].amount * 100) / 100;

        this.messageService.add({
            severity: 'success',
            summary: 'Ajuste Realizado',
            detail: `Última parcela ajustada automaticamente. Novo valor: ${this.installments[lastIndex].amount.toFixed(2)} AOA`
        });
    }

    // Expose Math.abs to template
    Math = Math;

    onSubmit(): void {
        const formValue = this.contractForm.getRawValue(); // Get all values including disabled

        // Validate
        if (!formValue.student || !formValue.productId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor preencha todos os campos obrigatórios'
            });
            return;
        }

        // Check if currently editing an installment
        if (this.editingInstallmentIndex !== null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Por favor, salve ou cancele a edição da parcela antes de criar o contrato'
            });
            return;
        }

        // Validate installment totals match contract total
        const totalInstallments = this.getTotalInstallmentsAmount();
        const difference = Math.abs(this.contractSummary.finalAmount - totalInstallments);

        if (difference > 0.01) {
            const confirmed = confirm(
                `ATENÇÃO: A soma das parcelas (${totalInstallments.toFixed(2)} AOA) difere do valor total do contrato (${this.contractSummary.finalAmount.toFixed(2)} AOA).\n\n` +
                `Diferença: ${difference.toFixed(2)} AOA\n\n` +
                `Deseja continuar mesmo assim?`
            );

            if (!confirmed) {
                return;
            }
        }

        this.loading = true;

        // Explicitly map installments to ensure all properties including status are sent
        const mappedInstallments = this.installments.length > 0
            ? this.installments.map(inst => ({
                installmentNumber: inst.installmentNumber,
                dueDate: inst.dueDate,
                amount: inst.amount,
                status: inst.status
            }))
            : undefined;

        const payload: CreateStudentContractRequest = {
            studentId: formValue.student.id || this.createdStudentId!,
            productId: formValue.productId,
            materialProductId: formValue.materialProductId || undefined,
            companyId: formValue.companyId || undefined,
            durationMonths: formValue.durationMonths || undefined,
            amount: this.contractSummary.finalAmount || 0,
            enrollmentFee: 0,
            enrollmentFeePaid: true,
            discountPercent: formValue.discountPercent ?? 0,
            unitPrice: Number(formValue.levelPrice || 0),
            contractLevel: formValue.levelId ? {
                levelId: formValue.levelId,
                duration: Number(formValue.duration || 0),
                levelPrice: Number(formValue.levelPrice || 0),
                courseMaterialPrice: Number(formValue.courseMaterialPrice || 0),
                finalCourseMaterialPrice: Number(formValue.courseMaterialPrice || 0),
                courseMaterialPaid: Boolean(formValue.courseMaterialPaid),
                includeRegistrationFee: Boolean(formValue.includeRegistrationFee),
                notes: formValue.levelNotes
            } : undefined,
            includeRegistrationFee: Boolean(formValue.includeRegistrationFee),
            numberOfLevelsOffered: 0,
            notes: formValue.notes,
            contractType: formValue.contractType,
            numberOfInstallments: formValue.numberOfInstallments,
            firstInstallmentDate: this.installments.length > 0 ? this.installments[0].dueDate : undefined,
            customInstallments: mappedInstallments
        };

        console.log('Contract Payload:', JSON.stringify(payload, null, 2));

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

                // Navigate to contract list if this is a standalone renewal (not embedded in create flow)
                if (this.renewContract && !this.createdStudentId) {
                    setTimeout(() => {
                        this.router.navigate(['/finances/contracts']).then();
                    }, 1500);
                }
            },
            error: (err) => {
                ShowToastErrorService.showToastError('Erro', err, this.messageService, 'Falha ao criar contrato.');
                this.loading = false;
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

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
