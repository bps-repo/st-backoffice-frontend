import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-pagamentos',
    imports: [
        CommonModule,
        TableModule,
        CardModule,
        ButtonModule,
        TagModule,
        ChartModule
    ],
    templateUrl: './pagamentos.component.html'
})
export class PagamentosComponent implements OnInit {
    payments = [
        {
            id: 1,
            date: '2023-06-01',
            amount: 250.00,
            method: 'Credit Card',
            status: 'Paid',
            description: 'Monthly Tuition - June 2023'
        },
        {
            id: 2,
            date: '2023-05-01',
            amount: 250.00,
            method: 'Bank Transfer',
            status: 'Paid',
            description: 'Monthly Tuition - May 2023'
        },
        {
            id: 3,
            date: '2023-04-01',
            amount: 250.00,
            method: 'Cash',
            status: 'Paid',
            description: 'Monthly Tuition - April 2023'
        },
        {
            id: 4,
            date: '2023-07-01',
            amount: 250.00,
            method: '',
            status: 'Pending',
            description: 'Monthly Tuition - July 2023'
        }
    ];

    invoices = [
        {
            id: 'INV-2023-001',
            date: '2023-06-01',
            dueDate: '2023-06-15',
            amount: 250.00,
            status: 'Paid',
            description: 'Monthly Tuition - June 2023',
            installments: [
                { number: 1, dueDate: '2023-06-15', amount: 125.00, status: 'Paid', paymentDate: '2023-06-10' },
                { number: 2, dueDate: '2023-06-30', amount: 125.00, status: 'Paid', paymentDate: '2023-06-28' }
            ],
            installmentProgress: 100 // percentage
        },
        {
            id: 'INV-2023-002',
            date: '2023-07-01',
            dueDate: '2023-07-15',
            amount: 250.00,
            status: 'Unpaid',
            description: 'Monthly Tuition - July 2023',
            installments: [
                { number: 1, dueDate: '2023-07-15', amount: 125.00, status: 'Unpaid', paymentDate: null },
                { number: 2, dueDate: '2023-07-30', amount: 125.00, status: 'Unpaid', paymentDate: null }
            ],
            installmentProgress: 0 // percentage
        },
        {
            id: 'INV-2023-003',
            date: '2023-08-01',
            dueDate: '2023-08-15',
            amount: 250.00,
            status: 'Partial',
            description: 'Monthly Tuition - August 2023',
            installments: [
                { number: 1, dueDate: '2023-08-15', amount: 125.00, status: 'Paid', paymentDate: '2023-08-12' },
                { number: 2, dueDate: '2023-08-30', amount: 125.00, status: 'Unpaid', paymentDate: null }
            ],
            installmentProgress: 50 // percentage
        }
    ];

    paymentSummary = {
        totalPaid: 750.00,
        pendingPayments: 250.00,
        nextPaymentDue: '2023-07-15',
        paymentMethod: 'Credit Card'
    };

    paymentHistoryData: any;
    paymentHistoryOptions: any;

    ngOnInit() {
        this.paymentHistoryData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'Payment Amount',
                    data: [250, 250, 250, 250, 250, 250],
                    backgroundColor: '#42A5F5',
                    borderColor: '#42A5F5',
                    fill: false,
                    tension: 0.4
                }
            ]
        };

        this.paymentHistoryOptions = {
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (USD)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        };
    }

    getSeverity(status: string) {
        switch (status) {
            case 'Paid':
                return 'success';
            case 'Unpaid':
                return 'warning';
            case 'Pending':
                return 'info';
            case 'Overdue':
                return 'danger';
            case 'Partial':
                return 'info';
            default:
                return 'info';
        }
    }

    getProgressBarClass(progress: number) {
        if (progress === 100) {
            return 'bg-green-500';
        } else if (progress >= 50) {
            return 'bg-blue-500';
        } else if (progress > 0) {
            return 'bg-yellow-500';
        } else {
            return 'bg-gray-300';
        }
    }

    makePayment() {
        console.log('Payment initiated');
        // In a real application, this would open a centers form or redirect to a centers gateway
    }
}
