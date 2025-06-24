import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-invoices',
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TagModule,
        CardModule,
        DropdownModule,
        FormsModule
    ],
    templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit {
    invoices: any[] = [];
    selectedYear: number = new Date().getFullYear();
    years: any[] = [];

    ngOnInit() {
        // Generate years for dropdown
        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 2; i <= currentYear + 1; i++) {
            this.years.push({label: i.toString(), value: i});
        }

        // Mock data for invoices
        this.invoices = [
            {
                id: 'INV-2023-001',
                date: '2023-01-15',
                dueDate: '2023-01-30',
                amount: 250.00,
                status: 'Paid',
                description: 'Monthly Tuition - January 2023',
                paymentMethod: 'Credit Card',
                paymentDate: '2023-01-20'
            },
            {
                id: 'INV-2023-002',
                date: '2023-02-01',
                dueDate: '2023-02-15',
                amount: 250.00,
                status: 'Paid',
                description: 'Monthly Tuition - February 2023',
                paymentMethod: 'Bank Transfer',
                paymentDate: '2023-02-10'
            },
            {
                id: 'INV-2023-003',
                date: '2023-03-01',
                dueDate: '2023-03-15',
                amount: 250.00,
                status: 'Paid',
                description: 'Monthly Tuition - March 2023',
                paymentMethod: 'Cash',
                paymentDate: '2023-03-05'
            },
            {
                id: 'INV-2023-004',
                date: '2023-04-01',
                dueDate: '2023-04-15',
                amount: 250.00,
                status: 'Paid',
                description: 'Monthly Tuition - April 2023',
                paymentMethod: 'Credit Card',
                paymentDate: '2023-04-12'
            },
            {
                id: 'INV-2023-005',
                date: '2023-05-01',
                dueDate: '2023-05-15',
                amount: 250.00,
                status: 'Paid',
                description: 'Monthly Tuition - May 2023',
                paymentMethod: 'Bank Transfer',
                paymentDate: '2023-05-10'
            },
            {
                id: 'INV-2023-006',
                date: '2023-06-01',
                dueDate: '2023-06-15',
                amount: 250.00,
                status: 'Paid',
                description: 'Monthly Tuition - June 2023',
                paymentMethod: 'Credit Card',
                paymentDate: '2023-06-08'
            },
            {
                id: 'INV-2023-007',
                date: '2023-07-01',
                dueDate: '2023-07-15',
                amount: 250.00,
                status: 'Unpaid',
                description: 'Monthly Tuition - July 2023',
                paymentMethod: '',
                paymentDate: ''
            }
        ];
    }

    getSeverity(status: string) {
        switch (status) {
            case 'Paid':
                return 'success';
            case 'Unpaid':
                return 'warning';
            case 'Overdue':
                return 'danger';
            default:
                return 'info';
        }
    }

    getTotalAmount(): number {
        return this.invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    }

    getPaidInvoicesCount(): number {
        return this.invoices.filter(i => i.status === 'Paid').length;
    }

    getUnpaidInvoicesCount(): number {
        return this.invoices.filter(i => i.status === 'Unpaid').length;
    }

    downloadInvoice(invoice: any) {
        console.log('Downloading invoice:', invoice.id);
        // In a real application, this would trigger a download
    }

    viewInvoice(invoice: any) {
        console.log('Viewing invoice:', invoice.id);
        // In a real application, this would open a modal or navigate to a student view
    }

    payInvoice(invoice: any) {
        console.log('Paying invoice:', invoice.id);
        // In a real application, this would open a payment form or redirect to a payment gateway
    }
}
