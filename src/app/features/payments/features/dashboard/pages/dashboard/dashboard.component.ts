import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  recentPayments: any[] = [];
  upcomingInstallments: any[] = [];
  paymentStats = {
    totalPaid: 0,
    pendingAmount: 0,
    overdueAmount: 0
  };

  constructor() { }

  ngOnInit(): void {
    // In a real application, these would be fetched from a service
    this.loadMockData();
  }

  loadMockData(): void {
    // Mock data for demonstration
    this.recentPayments = [
      { id: 1, invoice_id: 101, amount: 500, payment_date: new Date('2025-05-20'), payment_method: 'Credit Card', status: 'completed' },
      { id: 2, invoice_id: 102, amount: 750, payment_date: new Date('2025-05-18'), payment_method: 'Bank Transfer', status: 'completed' },
      { id: 3, invoice_id: 103, amount: 1200, payment_date: new Date('2025-05-15'), payment_method: 'PayPal', status: 'completed' }
    ];

    this.upcomingInstallments = [
      { id: 1, payment_id: 4, amount: 300, due_date: new Date('2025-06-01'), status: 'pending', number: 2, total_installments: 3 },
      { id: 2, payment_id: 5, amount: 450, due_date: new Date('2025-06-05'), status: 'pending', number: 1, total_installments: 2 },
      { id: 3, payment_id: 6, amount: 200, due_date: new Date('2025-06-10'), status: 'pending', number: 3, total_installments: 3 }
    ];

    this.paymentStats = {
      totalPaid: 2450,
      pendingAmount: 950,
      overdueAmount: 150
    };
  }
}
