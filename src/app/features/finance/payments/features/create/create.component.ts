import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import {Payment, PaymentInstallmentStatus, PaymentStatus} from "../../../../../core/models/payment/payment.model";

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class CreateComponent implements OnInit {
    paymentForm: FormGroup;
    invoices: any[] = []; // In a real app, this would be fetched from a service
    paymentMethods: string[] = ['Credit Card', 'Bank Transfer', 'Cash', 'PayPal', 'Other'];

    constructor(private fb: FormBuilder) {
        this.paymentForm = this.fb.group({
            invoice_id: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(0)]],
            payment_method: ['', Validators.required],
            payment_date: [new Date().toISOString().split('T')[0], Validators.required],
            reference: [''],
            notes: [''],
            installments_enabled: [false],
            total_installments: [1, [Validators.min(1), Validators.max(12)]],
            installments: this.fb.array([])
        });
    }

    ngOnInit(): void {
        // In a real app, fetch invoices from a service
        this.loadMockInvoices();

        // Watch for changes to installments_enabled and total_installments
        this.paymentForm.get('installments_enabled')?.valueChanges.subscribe(enabled => {
            if (enabled) {
                this.updateInstallments();
            } else {
                this.clearInstallments();
            }
        });

        this.paymentForm.get('total_installments')?.valueChanges.subscribe(count => {
            if (this.paymentForm.get('installments_enabled')?.value) {
                this.updateInstallments();
            }
        });

        this.paymentForm.get('amount')?.valueChanges.subscribe(amount => {
            if (this.paymentForm.get('installments_enabled')?.value) {
                this.updateInstallmentAmounts();
            }
        });
    }

    loadMockInvoices(): void {
        this.invoices = [
            {id: 101, invoice_number: 'INV-2025-001', client: 'John Doe', amount: 1500, due_date: '2025-06-25'},
            {id: 102, invoice_number: 'INV-2025-002', client: 'Jane Smith', amount: 2200, due_date: '2025-07-15'},
            {id: 103, invoice_number: 'INV-2025-003', client: 'Acme Corp', amount: 3500, due_date: '2025-06-30'}
        ];
    }

    get installmentsArray(): FormArray {
        return this.paymentForm.get('installments') as FormArray;
    }

    clearInstallments(): void {
        while (this.installmentsArray.length) {
            this.installmentsArray.removeAt(0);
        }
    }

    updateInstallments(): void {
        this.clearInstallments();

        const totalAmount = this.paymentForm.get('amount')?.value || 0;
        const installmentCount = this.paymentForm.get('total_installments')?.value || 1;
        const baseAmount = Math.floor(totalAmount / installmentCount);
        const remainder = totalAmount - (baseAmount * installmentCount);

        const today = new Date();

        for (let i = 0; i < installmentCount; i++) {
            const dueDate = new Date(today);
            dueDate.setMonth(dueDate.getMonth() + i);

            // First installment gets any remainder to avoid rounding issues
            const amount = i === 0 ? baseAmount + remainder : baseAmount;

            this.installmentsArray.push(this.fb.group({
                amount: [amount, [Validators.required, Validators.min(0)]],
                due_date: [dueDate.toISOString().split('T')[0], Validators.required],
                number: [i + 1],
                total_installments: [installmentCount],
                status: [PaymentInstallmentStatus.PENDING]
            }));
        }
    }

    updateInstallmentAmounts(): void {
        if (this.installmentsArray.length === 0) return;

        const totalAmount = this.paymentForm.get('amount')?.value || 0;
        const installmentCount = this.installmentsArray.length;
        const baseAmount = Math.floor(totalAmount / installmentCount);
        const remainder = totalAmount - (baseAmount * installmentCount);

        for (let i = 0; i < installmentCount; i++) {
            const amount = i === 0 ? baseAmount + remainder : baseAmount;
            this.installmentsArray.at(i).get('amount')?.setValue(amount);
        }
    }

    onSubmit(): void {
        if (this.paymentForm.invalid) {
            return;
        }

        const formValue = this.paymentForm.value;
        const payment: Payment = {
            invoice_id: formValue.invoice_id,
            amount: formValue.amount,
            payment_date: new Date(formValue.payment_date),
            payment_method: formValue.payment_method,
            status: formValue.installments_enabled ? PaymentStatus.PARTIAL : PaymentStatus.COMPLETED,
            reference: formValue.reference,
            notes: formValue.notes
        };

        if (formValue.installments_enabled && formValue.installments.length > 0) {
            payment.installments = formValue.installments.map((inst: any) => ({
                payment_id: 0, // This would be set after centers is created
                amount: inst.amount,
                due_date: new Date(inst.due_date),
                status: PaymentInstallmentStatus.PENDING,
                number: inst.number,
                total_installments: inst.total_installments
            }));
        }

        console.log('Payment to be created:', payment);

        // In a real app, this would be sent to a service to save
        // After saving, navigate to the centers details page
        // this.router.navigate(['/payments/installments']);
    }
}
