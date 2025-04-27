import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';

interface Report {
    id: string;
    name: string;
    type: string;
    generatedDate: string;
    generatedBy: string;
    status: string;
    description?: string;
    parameters?: { name: string; value: string }[];
    data?: any;
}

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule, SkeletonModule, InputTextModule, InputTextareaModule, ButtonModule]
})
export class DetailComponent implements OnInit {
    reportId: string = '';
    report: Report | null = null;
    loading: boolean = true;

    // Sample data - in a real app, this would come from a service
    reports: Report[] = [
        {
            id: '1',
            name: 'Student Performance Report',
            type: 'Performance',
            generatedDate: '2023-01-15',
            generatedBy: 'Admin User',
            status: 'Generated',
            description: 'This report shows the performance of students across different courses.',
            parameters: [
                { name: 'Start Date', value: '2023-01-01' },
                { name: 'End Date', value: '2023-01-15' },
                { name: 'Course', value: 'All' }
            ],
            data: {
                labels: ['English', 'Math', 'Science', 'History'],
                datasets: [
                    {
                        label: 'Average Score',
                        data: [75, 82, 68, 90]
                    }
                ]
            }
        },
        {
            id: '2',
            name: 'Class Attendance Report',
            type: 'Attendance',
            generatedDate: '2023-02-20',
            generatedBy: 'Admin User',
            status: 'Generated',
            description: 'This report shows the attendance of students in different lessons.',
            parameters: [
                { name: 'Start Date', value: '2023-02-01' },
                { name: 'End Date', value: '2023-02-20' },
                { name: 'Class', value: 'All' }
            ],
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Attendance Rate',
                        data: [95, 88, 92, 90]
                    }
                ]
            }
        },
        {
            id: '3',
            name: 'Financial Summary Report',
            type: 'Financial',
            generatedDate: '2023-03-10',
            generatedBy: 'Admin User',
            status: 'Pending',
            description: 'This report shows the financial summary of the school.',
            parameters: [
                { name: 'Start Date', value: '2023-03-01' },
                { name: 'End Date', value: '2023-03-10' },
                { name: 'Department', value: 'All' }
            ]
        }
    ];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.reportId = params['id'];
            this.loadReport();
        });
    }

    loadReport(): void {
        // Simulate API call
        setTimeout(() => {
            this.report = this.reports.find(r => r.id === this.reportId) || null;
            this.loading = false;
        }, 500);
    }

    downloadReport(): void {
        // In a real app, this would trigger a download of the report
        console.log('Downloading report:', this.report);
        alert('Report download started');
    }

    regenerateReport(): void {
        // In a real app, this would regenerate the report with the same parameters
        console.log('Regenerating report:', this.report);
        alert('Report regeneration started');
    }
}
