import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextarea } from 'primeng/inputtextarea';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import { CreateInvoiceRequest } from 'src/app/core/models/invoice/invoice.model';
import { StudentService } from 'src/app/core/services/student.service';
import { Student } from 'src/app/core/models/academic/students/student';
import { CenterService } from 'src/app/core/services/center.service';
import { Center } from 'src/app/core/models/corporate/center';
import { ServiceService } from 'src/app/core/services/service.service';
import { Service } from 'src/app/core/models/course/service';

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
        InputTextarea
    ],
    templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);
    private invoiceService = inject(InvoiceService);
    private studentService = inject(StudentService);
    private centerService = inject(CenterService);
    private serviceService = inject(ServiceService);

    saleForm!: FormGroup;
    loading = false;
    loadingStudents = false;
    loadingCenters = false;
    loadingServices = false;
    error: string | null = null;
    students: Student[] = [];
    centers: Center[] = [];
    services: Service[] = [];
    studentOptions: Array<{ label: string; value: string }> = [];
    centerOptions: Array<{ label: string; value: string }> = [];
    availableProducts: Array<{ label: string; value: string; price: number; name: string }> = [];

    // Payment method options
    paymentMethodOptions = [
        { label: 'Dinheiro', value: 'Dinheiro' },
        { label: 'Transferência', value: 'Transferência' },
        { label: 'Multicaixa', value: 'Multicaixa' },
        { label: 'Cartão de Crédito', value: 'Cartão de Crédito' },
        { label: 'Cartão de Débito', value: 'Cartão de Débito' }
    ];

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initForm();
        this.setupFormListeners();
        this.loadStudents();
        this.loadCenters();
        this.loadServices();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm(): void {
        this.saleForm = this.formBuilder.group({
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
                quantity: [1, [Validators.required, Validators.min(1)]],
                unitPrice: [0, [Validators.required, Validators.min(0)]],
                centerProductId: ['', Validators.required],
            }),
            payment: this.formBuilder.group({
                method: ['Dinheiro', Validators.required]
            }),
            notes: ['']
        });
    }

    private loadStudents(): void {
        this.loadingStudents = true;

        this.studentService.getStudents().pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (students) => {
                this.students = students;
                this.studentOptions = students.map((student) => ({
                    value: student.id || '',
                    label: `${student.user?.firstname || ''} ${student.user?.lastname || ''}`.trim() || student.user?.email || `Aluno #${student.code}`,
                })).filter((option) => option.value);
                this.loadingStudents = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar alunos: ' + (error?.error?.message || error.message || 'erro desconhecido');
                this.loadingStudents = false;
            }
        });
    }

    private loadCenters(): void {
        this.loadingCenters = true;

        this.centerService.getAllCenters().pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (centers) => {
                this.centers = centers;
                this.centerOptions = centers.map((center) => ({
                    value: center.id,
                    label: center.name,
                }));
                this.loadingCenters = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar centros: ' + (error?.error?.message || error.message || 'erro desconhecido');
                this.loadingCenters = false;
            }
        });
    }

    private loadServices(): void {
        this.loadingServices = true;

        this.serviceService.getServices(0, 200).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (response) => {
                const services = response.data?.content || [];
                this.services = services;
                this.availableProducts = services.map((service) => ({
                    value: service.id,
                    label: service.name,
                    name: service.name,
                    price: service.value || 0,
                }));
                this.loadingServices = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar serviços: ' + (error?.error?.message || error.message || 'erro desconhecido');
                this.loadingServices = false;
            }
        });
    }

    private setupFormListeners(): void {
        // Listen to product selection to auto-fill service and price
        this.saleForm.get('product.centerProductId')?.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe((centerProductId) => {
            if (centerProductId) {
                const selectedProduct = this.availableProducts.find((p) => p.value === centerProductId);
                if (selectedProduct) {
                    this.saleForm.patchValue({
                        product: {
                            name: selectedProduct.name,
                            unitPrice: selectedProduct.price
                        }
                    }, { emitEvent: false });
                }
            }
        });

        this.saleForm.get('client.studentId')?.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe((studentId) => {
            const selectedStudent = this.students.find((student) => student.id === studentId);
            if (!selectedStudent) {
                this.saleForm.patchValue({
                    client: {
                        name: '',
                        email: '',
                        phone: '',
                        customerId: '',
                        centerId: '',
                    }
                }, { emitEvent: false });
                return;
            }

            this.saleForm.patchValue({
                client: {
                    name: `${selectedStudent.user?.firstname || ''} ${selectedStudent.user?.lastname || ''}`.trim(),
                    email: selectedStudent.user?.email || '',
                    phone: selectedStudent.user?.phone || '',
                    customerId: selectedStudent.id || '',
                }
            }, { emitEvent: false });

            if (selectedStudent.center?.id) {
                this.saleForm.patchValue({
                    client: {
                        centerId: selectedStudent.center.id
                    }
                }, { emitEvent: false });
            }
        });
    }

    get totalAmount(): number {
        const quantity = this.saleForm.get('product.quantity')?.value || 0;
        const unitPrice = this.saleForm.get('product.unitPrice')?.value || 0;
        return quantity * unitPrice;
    }

    get isFormValid(): boolean {
        return this.saleForm.valid && this.totalAmount > 0;
    }

    onCancel(): void {
        this.router.navigate(['/finances/sales']);
    }

    onSave(): void {
        if (!this.isFormValid) return;

        this.loading = true;
        this.error = null;

        const formValue = this.saleForm.value;
        const payload: CreateInvoiceRequest = {
            documentType: 'PROFORMA',
            issueDate: new Date().toISOString().split('T')[0],
            customerId: formValue.client.customerId,
            centerId: formValue.client.centerId,
            description: formValue.product.name,
            notes: formValue.notes || '',
            discountAmount: 0,
            items: [
                {
                    centerProductId: formValue.product.centerProductId,
                    productName: formValue.product.name,
                    quantity: formValue.product.quantity,
                    unitPrice: formValue.product.unitPrice,
                    discountAmount: 0,
                },
            ],
        };

        this.invoiceService.createInvoice(payload).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: ({ data }) => {
                this.loading = false;
                this.router.navigate(['/finances/sales', data.id]);
            },
            error: (error) => {
                this.error = 'Erro ao criar fatura: ' + (error?.error?.message || error.message);
                this.loading = false;
            }
        });
    }

    onSaveAndIssueInvoice(): void {
        // For now, just save the sale
        this.onSave();
        // TODO: Implement invoice generation
    }

    onSaveAndIssueReceipt(): void {
        // For now, just save the sale
        this.onSave();
        // TODO: Implement receipt generation
    }
}
