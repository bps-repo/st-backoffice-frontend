import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
    Subject,
    catchError,
    debounceTime,
    distinctUntilChanged,
    finalize,
    map,
    of,
    switchMap,
    takeUntil,
} from 'rxjs';
import { DropdownFilterEvent } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextarea } from 'primeng/inputtextarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import {
    CreateInvoiceAction,
    CreateInvoiceRequest,
    INVOICE_PAYMENT_METHOD_OPTIONS,
} from 'src/app/core/models/invoice/invoice.model';
import { StudentService } from 'src/app/core/services/student.service';
import { Student } from 'src/app/core/models/academic/students/student';
import { CenterService } from 'src/app/core/services/center.service';
import { Center } from 'src/app/core/models/corporate/center';
import { ServiceService } from 'src/app/core/services/service.service';
import { Service } from 'src/app/core/models/course/service';
import { isStandaloneSaleProduct } from 'src/app/core/constants/service-options';
import { PaymentMethod } from 'src/app/core/models/payment/installment';
import { ShowToastErrorService } from 'src/app/shared/services/show-toast-error-service';

@Component({
    selector: 'app-create-sale',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        InputNumberModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputTextarea,
        DatePickerModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);
    private invoiceService = inject(InvoiceService);
    private studentService = inject(StudentService);
    private centerService = inject(CenterService);
    private serviceService = inject(ServiceService);
    private cdr = inject(ChangeDetectorRef);
    private messageService = inject(MessageService);

    saleForm!: FormGroup;
    loading = false;
    loadingStudents = false;
    loadingCenters = false;
    loadingServices = false;
    students: Student[] = [];
    centers: Center[] = [];
    services: Service[] = [];
    studentOptions: Array<{ label: string; value: string }> = [];
    centerOptions: Array<{ label: string; value: string }> = [];
    availableProducts: Array<{ label: string; value: string; price: number; name: string }> = [];

    readonly paymentMethodOptions = INVOICE_PAYMENT_METHOD_OPTIONS;

    private destroy$ = new Subject<void>();
    private studentSearch$ = new Subject<string>();
    private readonly minStudentSearchLength = 2;

    ngOnInit(): void {
        this.initForm();
        this.setupFormListeners();
        this.setupStudentSearch();
        this.loadCenters();
        this.loadServices();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm(): void {
        this.saleForm = this.formBuilder.group({
            issueDate: [new Date(), Validators.required],
            description: ['', Validators.required],
            discountAmount: [0, [Validators.required, Validators.min(0)]],
            client: this.formBuilder.group({
                studentId: ['', Validators.required],
                name: ['', Validators.required],
                email: [''],
                phone: [''],
                customerId: ['', Validators.required],
                centerId: ['', Validators.required],
            }),
            product: this.formBuilder.group({
                name: ['', Validators.required],
                quantity: [1, [Validators.required, Validators.min(0.01)]],
                unitPrice: [0, [Validators.required, Validators.min(0)]],
                discountAmount: [0, [Validators.required, Validators.min(0)]],
                centerProductId: ['', Validators.required],
            }),
            payment: this.formBuilder.group({
                method: [PaymentMethod.CASH, Validators.required],
            }),
            notes: [''],
        });
    }

    private setupStudentSearch(): void {
        this.studentSearch$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((query) => {
                    const trimmed = query.trim();
                    if (trimmed.length < this.minStudentSearchLength) {
                        this.students = [];
                        this.studentOptions = [];
                        return of([] as Student[]);
                    }

                    this.loadingStudents = true;
                    return this.studentService
                        .searchStudentsPaginated({ fullName: trimmed }, 0, 20)
                        .pipe(
                            map((response) => response.content ?? []),
                            catchError((error) => {
                                this.showApiError('Erro ao pesquisar alunos', error);
                                return of([] as Student[]);
                            }),
                            finalize(() => {
                                this.loadingStudents = false;
                                this.cdr.detectChanges();
                            }),
                        );
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((students) => {
                this.students = students;
                this.studentOptions = students
                    .map((student) => this.toStudentOption(student))
                    .filter((option) => option.value);
                this.cdr.detectChanges();
            });
    }

    onStudentFilter(event: DropdownFilterEvent): void {
        this.studentSearch$.next(event.filter ?? '');
    }

    private toStudentOption(student: Student): { label: string; value: string } {
        return {
            value: student.id || '',
            label:
                `${student.user?.firstname || ''} ${student.user?.lastname || ''}`.trim() ||
                student.user?.email ||
                `Aluno #${student.code}`,
        };
    }

    private loadCenters(): void {
        this.loadingCenters = true;

        this.centerService.getAllCenters().pipe(takeUntil(this.destroy$)).subscribe({
            next: (centers) => {
                this.centers = centers;
                this.centerOptions = centers.map((center) => ({
                    value: center.id,
                    label: center.name,
                }));
                this.loadingCenters = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                this.showApiError('Erro ao carregar centros', error);
                this.loadingCenters = false;
                this.cdr.detectChanges();
            },
        });
    }

    private loadServices(): void {
        this.loadingServices = true;

        this.serviceService.getServices(0, 200).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                const services = (response.data?.content || []).filter(
                    (service) => service.active && isStandaloneSaleProduct(service.category),
                );
                this.services = services;
                this.availableProducts = services.map((service) => ({
                    value: service.id,
                    label: service.name,
                    name: service.name,
                    price: service.value || 0,
                }));
                this.loadingServices = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                this.showApiError('Erro ao carregar produtos', error);
                this.loadingServices = false;
                this.cdr.detectChanges();
            },
        });
    }

    private setupFormListeners(): void {
        this.saleForm
            .get('product.centerProductId')
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((centerProductId) => {
                if (!centerProductId) return;

                const selectedProduct = this.availableProducts.find((p) => p.value === centerProductId);
                if (selectedProduct) {
                    this.saleForm.patchValue(
                        {
                            product: {
                                name: selectedProduct.name,
                                unitPrice: selectedProduct.price,
                            },
                            description: this.saleForm.get('description')?.value || selectedProduct.name,
                        },
                        { emitEvent: false },
                    );
                }
            });

        this.saleForm
            .get('client.studentId')
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((studentId) => {
                const selectedStudent = this.students.find((student) => student.id === studentId);
                if (!selectedStudent) {
                    this.saleForm.patchValue(
                        {
                            client: {
                                name: '',
                                email: '',
                                phone: '',
                                customerId: '',
                                centerId: '',
                            },
                        },
                        { emitEvent: false },
                    );
                    return;
                }

                this.saleForm.patchValue(
                    {
                        client: {
                            name: `${selectedStudent.user?.firstname || ''} ${selectedStudent.user?.lastname || ''}`.trim(),
                            email: selectedStudent.user?.email || '',
                            phone: selectedStudent.user?.phone || '',
                            customerId: selectedStudent.id || '',
                        },
                    },
                    { emitEvent: false },
                );

                if (selectedStudent.center?.id) {
                    this.saleForm.patchValue(
                        {
                            client: {
                                centerId: selectedStudent.center.id,
                            },
                        },
                        { emitEvent: false },
                    );
                }
            });
    }

    get subtotal(): number {
        const quantity = this.saleForm.get('product.quantity')?.value || 0;
        const unitPrice = this.saleForm.get('product.unitPrice')?.value || 0;
        return quantity * unitPrice;
    }

    get totalAmount(): number {
        const itemDiscount = this.saleForm.get('product.discountAmount')?.value || 0;
        const invoiceDiscount = this.saleForm.get('discountAmount')?.value || 0;
        return Math.max(0, this.subtotal - itemDiscount - invoiceDiscount);
    }

    get isFormValid(): boolean {
        return this.saleForm.valid && this.totalAmount > 0;
    }

    onCancel(): void {
        this.router.navigate(['/finances/sales']);
    }

    onSave(): void {
        this.submit('SAVE');
    }

    onSaveAndGenerateInvoice(): void {
        this.submit('SAVE_AND_GENERATE_INVOICE');
    }

    onSaveAndGeneratePayment(): void {
        this.submit('SAVE_AND_GENERATE_PAYMENT');
    }

    private buildPayload(action: CreateInvoiceAction): CreateInvoiceRequest {
        const formValue = this.saleForm.value;
        const issueDate: Date = formValue.issueDate;
        const pad = (n: number) => String(n).padStart(2, '0');

        return {
            action,
            issueDate: `${issueDate.getFullYear()}-${pad(issueDate.getMonth() + 1)}-${pad(issueDate.getDate())}`,
            customerId: formValue.client.customerId,
            centerId: formValue.client.centerId,
            description: formValue.description?.trim() || formValue.product.name,
            notes: formValue.notes?.trim() ?? '',
            paymentMethod: formValue.payment.method,
            discountAmount: formValue.discountAmount ?? 0,
            items: [
                {
                    centerProductId: formValue.product.centerProductId,
                    productName: formValue.product.name,
                    quantity: formValue.product.quantity,
                    unitPrice: formValue.product.unitPrice,
                    discountAmount: formValue.product.discountAmount ?? 0,
                },
            ],
        };
    }

    private submit(action: CreateInvoiceAction): void {
        this.saleForm.markAllAsTouched();

        if (!this.isFormValid) {
            if (this.saleForm.valid && this.totalAmount <= 0) {
                this.showValidationError('O total da venda deve ser maior que zero.');
            } else if (!this.saleForm.valid) {
                this.showValidationError('Verifique os campos obrigatórios do formulário.');
            }
            this.cdr.detectChanges();
            return;
        }

        this.loading = true;
        this.cdr.detectChanges();

        const payload = this.buildPayload(action);

        this.invoiceService
            .createInvoice(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ data }) => {
                    this.loading = false;
                    this.cdr.detectChanges();
                    this.router.navigate(['/finances/sales', data.id]);
                },
                error: (error) => {
                    this.showApiError('Erro ao criar venda', error);
                    this.loading = false;
                    this.cdr.detectChanges();
                },
            });
    }

    private showApiError(title: string, error: unknown): void {
        ShowToastErrorService.showToastError(title, error, this.messageService);
    }

    private showValidationError(detail: string): void {
        this.messageService.add({
            life: 5000,
            severity: 'error',
            summary: 'Validação',
            detail,
        });
    }
}
