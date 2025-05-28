export interface Payment {
    id?: number;
    invoice_id: number;
    amount: number;
    payment_date: Date;
    payment_method: string;
    status: PaymentStatus;
    reference?: string;
    notes?: string;
    installments?: PaymentInstallment[];
}

export interface PaymentInstallment {
    id?: number;
    payment_id: number;
    amount: number;
    due_date: Date;
    payment_date?: Date;
    status: PaymentInstallmentStatus;
    number: number; // Installment number (e.g., 1 of 3)
    total_installments: number; // Total number of installments
}

export enum PaymentStatus {
    PENDING = 'pending',
    PARTIAL = 'partial',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

export enum PaymentInstallmentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled'
}

export interface PaymentSettings {
    id?: number;
    max_installments: number;
    default_payment_method: string;
    allowed_payment_methods: string[];
    grace_period_days: number; // Days before an installment is marked as overdue
    auto_reminder: boolean; // Send automatic reminders for upcoming installments
    reminder_days_before: number; // Days before due date to send reminder
}

export interface PaymentReport {
    id?: number;
    name: string;
    type: PaymentReportType;
    filters?: PaymentReportFilter;
    created_at: Date;
    last_run?: Date;
    schedule?: PaymentReportSchedule;
}

export enum PaymentReportType {
    PAYMENTS_SUMMARY = 'payments_summary',
    INSTALLMENTS_STATUS = 'installments_status',
    OVERDUE_PAYMENTS = 'overdue_payments',
    PAYMENT_METHODS = 'payment_methods',
    CUSTOM = 'custom'
}

export interface PaymentReportFilter {
    date_from?: Date;
    date_to?: Date;
    payment_status?: PaymentStatus[];
    payment_methods?: string[];
    client_id?: number;
    invoice_id?: number;
}

export interface PaymentReportSchedule {
    frequency: PaymentReportFrequency;
    day_of_week?: number; // 0-6 (Sunday-Saturday)
    day_of_month?: number; // 1-31
    time: string; // HH:MM format
    recipients: string[]; // Email addresses
}

export enum PaymentReportFrequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly'
}
