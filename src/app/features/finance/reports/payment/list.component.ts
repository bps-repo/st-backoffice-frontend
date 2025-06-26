import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {PaymentReport, PaymentReportFrequency, PaymentReportType} from "../../../../core/models/payment/payment.model";

@Component({
    selector: 'app-general',
    templateUrl: './list.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class ListComponent implements OnInit {
    reports: PaymentReport[] = [];
    filterForm: FormGroup;
    loading: boolean = true;

    constructor(private fb: FormBuilder) {
        this.filterForm = this.fb.group({
            reportType: ['all'],
            dateRange: ['all']
        });
    }

    ngOnInit(): void {
        // In a real app, these would be fetched from a service
        this.loadMockData();

        this.filterForm.valueChanges.subscribe(() => {
            this.applyFilters();
        });
    }

    loadMockData(): void {
        // Mock data for demonstration
        this.reports = [
            {
                id: 1,
                name: 'Monthly Payments Summary',
                type: PaymentReportType.PAYMENTS_SUMMARY,
                created_at: new Date('2025-05-01'),
                last_run: new Date('2025-05-25'),
                schedule: {
                    frequency: PaymentReportFrequency.WEEKLY,
                    day_of_month: 1,
                    time: '08:00',
                    recipients: ['finance@example.com']
                }
            },
            {
                id: 2,
                name: 'Overdue Payments Report',
                type: PaymentReportType.OVERDUE_PAYMENTS,
                created_at: new Date('2025-04-15'),
                last_run: new Date('2025-05-24'),
                schedule: {
                    frequency: PaymentReportFrequency.DAILY,
                    day_of_week: 1, // Monday
                    time: '09:00',
                    recipients: ['finance@example.com', 'admin@example.com']
                }
            },
            {
                id: 3,
                name: 'Payment Methods Analysis',
                type: PaymentReportType.PAYMENT_METHODS,
                created_at: new Date('2025-03-10'),
                last_run: new Date('2025-05-20'),
                filters: {
                    date_from: new Date('2025-01-01'),
                    date_to: new Date('2025-12-31')
                }
            },
            {
                id: 4,
                name: 'Installments Status Report',
                type: PaymentReportType.INSTALLMENTS_STATUS,
                created_at: new Date('2025-05-10'),
                last_run: new Date('2025-05-22')
            },
            {
                id: 5,
                name: 'Custom Client Payment Report',
                type: PaymentReportType.CUSTOM,
                created_at: new Date('2025-04-20'),
                filters: {
                    client_id: 123
                }
            }
        ];

        this.loading = false;
    }

    applyFilters(): void {
        // In a real app, this would filter the data based on the form values
        console.log('Filters applied:', this.filterForm.value);
    }

    getReportTypeLabel(type: string): string {
        switch (type) {
            case PaymentReportType.PAYMENTS_SUMMARY:
                return 'Payments Summary';
            case PaymentReportType.INSTALLMENTS_STATUS:
                return 'Installments Status';
            case PaymentReportType.OVERDUE_PAYMENTS:
                return 'Overdue Payments';
            case PaymentReportType.PAYMENT_METHODS:
                return 'Payment Methods';
            case PaymentReportType.CUSTOM:
                return 'Custom Report';
            default:
                return 'Unknown';
        }
    }

    getReportTypeClass(type: string): string {
        switch (type) {
            case PaymentReportType.PAYMENTS_SUMMARY:
                return 'bg-primary';
            case PaymentReportType.INSTALLMENTS_STATUS:
                return 'bg-info';
            case PaymentReportType.OVERDUE_PAYMENTS:
                return 'bg-danger';
            case PaymentReportType.PAYMENT_METHODS:
                return 'bg-success';
            case PaymentReportType.CUSTOM:
                return 'bg-secondary';
            default:
                return 'bg-light';
        }
    }

    runReport(report: PaymentReport): void {
        // In a real app, this would trigger the report generation
        console.log('Running report:', report);

        // Update last_run date for demonstration
        const index = this.reports.findIndex(r => r.id === report.id);
        if (index !== -1) {
            this.reports[index].last_run = new Date();
        }
    }

    downloadReport(report: PaymentReport): void {
        // In a real app, this would download the report
        console.log('Downloading report:', report);
    }
}
