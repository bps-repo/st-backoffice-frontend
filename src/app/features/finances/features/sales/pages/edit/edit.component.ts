import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SalesService } from 'src/app/core/services/sales.service';
import { Sale } from 'src/app/core/models/finance/sale.model';

@Component({
    selector: 'app-edit-sale',
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
        ProgressSpinnerModule
    ],
    templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit, OnDestroy {
    saleId: string | null = null;
    saleForm!: FormGroup;
    loading = false;
    loadingSale = false;
    error: string | null = null;
    sale: Sale | null = null;

    // Product type options
    productTypeOptions = [
        { label: 'Livro Didático', value: 'Livro' },
        { label: 'Certificado', value: 'Certificado' },
        { label: 'Declaração', value: 'Declaração' },
        { label: 'Serviço', value: 'Serviço' }
    ];

    // Product options based on type
    productOptions: { [key: string]: any[] } = {
        'Livro': [
            { label: 'Livro English Course Level 1', value: 'Livro English Course Level 1', price: 2500 },
            { label: 'Livro English Course Level 2', value: 'Livro English Course Level 2', price: 2500 },
            { label: 'Livro English Course Level 3', value: 'Livro English Course Level 3', price: 2500 }
        ],
        'Certificado': [
            { label: 'Certificado de Conclusão', value: 'Certificado de Conclusão', price: 1500 },
            { label: 'Certificado de Participação', value: 'Certificado de Participação', price: 1000 }
        ],
        'Declaração': [
            { label: 'Declaração de Frequência', value: 'Declaração de Frequência', price: 500 },
            { label: 'Declaração de Matrícula', value: 'Declaração de Matrícula', price: 500 }
        ],
        'Serviço': [
            { label: 'Aula Particular', value: 'Aula Particular', price: 2000 },
            { label: 'Tradução de Documentos', value: 'Tradução de Documentos', price: 3000 }
        ]
    };

    // Payment method options
    paymentMethodOptions = [
        { label: 'Dinheiro', value: 'Dinheiro' },
        { label: 'Transferência', value: 'Transferência' },
        { label: 'Multicaixa', value: 'Multicaixa' },
        { label: 'Cartão de Crédito', value: 'Cartão de Crédito' },
        { label: 'Cartão de Débito', value: 'Cartão de Débito' }
    ];

    // Available products for current selection
    availableProducts: any[] = [];

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private salesService: SalesService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.saleId = params['id'];
            if (this.saleId) {
                this.loadSale();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadSale(): void {
        if (!this.saleId) return;

        this.loadingSale = true;
        this.error = null;

        this.salesService.getSaleById(this.saleId).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (sale) => {
                this.sale = sale;
                if (sale) {
                    this.initForm();
                    this.populateForm(sale);
                    this.setupFormListeners();
                }
                this.loadingSale = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar venda: ' + error.message;
                this.loadingSale = false;
            }
        });
    }

    private initForm(): void {
        this.saleForm = this.formBuilder.group({
            client: this.formBuilder.group({
                name: ['', Validators.required],
                email: [''],
                phone: ['']
            }),
            product: this.formBuilder.group({
                type: ['', Validators.required],
                name: ['', Validators.required],
                quantity: [1, [Validators.required, Validators.min(1)]],
                unitPrice: [0, [Validators.required, Validators.min(0)]]
            }),
            payment: this.formBuilder.group({
                method: ['Dinheiro', Validators.required]
            }),
            notes: ['']
        });
    }

    private populateForm(sale: Sale): void {
        this.saleForm.patchValue({
            client: {
                name: sale.client.name,
                email: sale.client.email || '',
                phone: sale.client.phone || ''
            },
            product: {
                type: sale.product.type,
                name: sale.product.name,
                quantity: sale.product.quantity,
                unitPrice: sale.product.unitPrice
            },
            payment: {
                method: sale.payment.method
            },
            notes: sale.notes || ''
        });

        // Update available products based on selected type
        this.availableProducts = this.productOptions[sale.product.type] || [];
    }

    private setupFormListeners(): void {
        // Listen to product type changes to update available products
        this.saleForm.get('product.type')?.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(type => {
            this.availableProducts = this.productOptions[type] || [];
            this.saleForm.patchValue({
                product: {
                    name: '',
                    unitPrice: 0
                }
            });
        });

        // Listen to product selection to auto-fill price
        this.saleForm.get('product.name')?.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(productName => {
            if (productName) {
                const selectedProduct = this.availableProducts.find(p => p.value === productName);
                if (selectedProduct) {
                    this.saleForm.patchValue({
                        product: {
                            unitPrice: selectedProduct.price
                        }
                    });
                }
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
        if (!this.isFormValid || !this.saleId) return;

        this.loading = true;
        this.error = null;

        const formValue = this.saleForm.value;
        const saleUpdates: Partial<Sale> = {
            client: {
                name: formValue.client.name,
                email: formValue.client.email || '',
                phone: formValue.client.phone || ''
            },
            product: {
                type: formValue.product.type,
                name: formValue.product.name,
                quantity: formValue.product.quantity,
                unitPrice: formValue.product.unitPrice,
                total: this.totalAmount
            },
            payment: {
                method: formValue.payment.method,
                status: this.sale?.payment.status || 'Pendente'
            },
            notes: formValue.notes || ''
        };

        this.salesService.updateSale(this.saleId, saleUpdates).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (sale) => {
                this.loading = false;
                this.router.navigate(['/finances/sales', sale.id]);
            },
            error: (error) => {
                this.error = 'Erro ao atualizar venda: ' + error.message;
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
