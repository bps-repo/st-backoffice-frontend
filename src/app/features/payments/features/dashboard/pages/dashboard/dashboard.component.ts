import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-students-materials-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, ChartModule]
})
export class DashboardComponent implements OnInit {
  recentPayments: any[] = [];
  upcomingInstallments: any[] = [];
  paymentStats = {
    totalPaid: 0,
    pendingAmount: 0,
    overdueAmount: 0
  };

  // Chart properties
  paymentDistributionData: any;
  paymentDistributionOptions: any;
  paymentTrendsData: any;
  paymentTrendsOptions: any;

  constructor() { }

  ngOnInit(): void {
    // In a real application, these would be fetched from a service
    this.loadMockData();

    // Initialize charts
    this.initPaymentDistributionChart();
    this.initPaymentTrendsChart();
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

  initPaymentDistributionChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    // Create chart data from payment stats
    this.paymentDistributionData = {
      labels: ['Paid', 'Pending', 'Overdue'],
      datasets: [
        {
          data: [
            this.paymentStats.totalPaid,
            this.paymentStats.pendingAmount,
            this.paymentStats.overdueAmount
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--red-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--red-400')
          ]
        }
      ]
    };

    this.paymentDistributionOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true,
            font: { weight: 700 },
            padding: 20
          },
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Payment Distribution',
          font: {
            size: 16
          }
        }
      },
      cutout: '60%'
    };
  }

  initPaymentTrendsChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    // Mock monthly payment data
    this.paymentTrendsData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Payments',
          data: [1200, 1900, 1500, 2800, 2450, 0],
          backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          borderColor: documentStyle.getPropertyValue('--primary-500')
        },
        {
          label: 'Installments',
          data: [800, 1100, 900, 1600, 950, 0],
          backgroundColor: documentStyle.getPropertyValue('--primary-300'),
          borderColor: documentStyle.getPropertyValue('--primary-300')
        }
      ]
    };

    this.paymentTrendsOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { weight: 500 }
          }
        },
        title: {
          display: true,
          text: 'Monthly Payment Trends',
          font: {
            size: 16
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: documentStyle.getPropertyValue('--surface-border') }
        },
        y: {
          ticks: { color: textColor },
          grid: { color: documentStyle.getPropertyValue('--surface-border') },
          beginAtZero: true
        }
      }
    };
  }
}
