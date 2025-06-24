import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PaymentSettings} from "../../../../core/models/payment/payment.model";

@Component({
    selector: 'app-settings',
    templateUrl: './payment-settings.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class PaymentSettingsComponent implements OnInit {
    settingsForm: FormGroup;
    loading: boolean = true;
    saving: boolean = false;
    saveSuccess: boolean = false;
    error: string | null = null;

    paymentMethods: string[] = [
        'Credit Card',
        'Debit Card',
        'Bank Transfer',
        'Cash',
        'PayPal',
        'Other'
    ];

    constructor(private fb: FormBuilder) {
        this.settingsForm = this.fb.group({
            max_installments: [3, [Validators.required, Validators.min(1), Validators.max(24)]],
            default_payment_method: ['Credit Card', Validators.required],
            allowed_payment_methods: [['Credit Card', 'Bank Transfer'], Validators.required],
            grace_period_days: [5, [Validators.required, Validators.min(0), Validators.max(30)]],
            auto_reminder: [true],
            reminder_days_before: [3, [Validators.required, Validators.min(1), Validators.max(14)]]
        });
    }

    ngOnInit(): void {
        // In a real app, these would be fetched from a service
        this.loadMockData();
    }

    loadMockData(): void {
        // Mock data for demonstration
        const settings: PaymentSettings = {
            id: 1,
            max_installments: 12,
            default_payment_method: 'Credit Card',
            allowed_payment_methods: ['Credit Card', 'Bank Transfer', 'PayPal'],
            grace_period_days: 5,
            auto_reminder: true,
            reminder_days_before: 3
        };

        // Patch form with settings
        this.settingsForm.patchValue(settings);
        this.loading = false;
    }

    onSubmit(): void {
        if (this.settingsForm.invalid) {
            return;
        }

        this.saving = true;
        this.saveSuccess = false;
        this.error = null;

        // In a real app, this would save to a service
        setTimeout(() => {
            console.log('Settings saved:', this.settingsForm.value);
            this.saving = false;
            this.saveSuccess = true;

            // Reset success message after 3 seconds
            setTimeout(() => {
                this.saveSuccess = false;
            }, 3000);
        }, 1000); // Simulate network delay
    }

    isPaymentMethodSelected(method: string): boolean {
        const allowedMethods = this.settingsForm.get('allowed_payment_methods')?.value || [];
        return allowedMethods.includes(method);
    }

    togglePaymentMethod(method: string): void {
        const allowedMethods = [...(this.settingsForm.get('allowed_payment_methods')?.value || [])];

        if (this.isPaymentMethodSelected(method)) {
            // Remove method if it's already selected
            const index = allowedMethods.indexOf(method);
            if (index !== -1) {
                allowedMethods.splice(index, 1);
            }
        } else {
            // Add method if it's not selected
            allowedMethods.push(method);
        }

        this.settingsForm.get('allowed_payment_methods')?.setValue(allowedMethods);
    }
}
