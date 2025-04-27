import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-acesso-portal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        InputSwitchModule,
        TableModule,
        ChartModule
    ],
    templateUrl: './acesso-portal.component.html',
})
export class AcessoPortalComponent implements OnInit {
    userInfo = {
        username: 'manuel.ikuma',
        email: 'manuel.ikuma@example.com',
        lastLogin: '2023-06-10 14:30',
        status: true,
        accountCreated: '2023-01-15',
        passwordLastChanged: '2023-03-20'
    };

    loginHistory = [
        { date: '2023-06-10 14:30', device: 'Mobile - Android', ip: '192.168.1.1', location: 'Luanda, Angola' },
        { date: '2023-06-08 09:15', device: 'Desktop - Chrome', ip: '192.168.1.1', location: 'Luanda, Angola' },
        { date: '2023-06-05 16:45', device: 'Tablet - iPad', ip: '192.168.1.2', location: 'Luanda, Angola' },
        { date: '2023-06-01 10:30', device: 'Desktop - Firefox', ip: '192.168.1.1', location: 'Luanda, Angola' }
    ];

    activityData: any;
    activityOptions: any;

    ngOnInit() {
        this.activityData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'Login Activity',
                    data: [12, 8, 15, 10, 14, 9],
                    backgroundColor: '#42A5F5',
                    borderColor: '#42A5F5',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Course Access',
                    data: [5, 10, 8, 15, 12, 7],
                    backgroundColor: '#66BB6A',
                    borderColor: '#66BB6A',
                    fill: false,
                    tension: 0.4
                }
            ]
        };

        this.activityOptions = {
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
                        text: 'Number of Activities'
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

    resetPassword() {
        // In a real application, this would trigger a password reset
        console.log('Password reset requested for user:', this.userInfo.username);
    }

    toggleAccountStatus() {
        this.userInfo.status = !this.userInfo.status;
        console.log('Account status changed to:', this.userInfo.status ? 'Active' : 'Inactive');
    }
}
