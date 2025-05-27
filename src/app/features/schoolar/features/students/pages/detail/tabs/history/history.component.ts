import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { TimelineModule } from 'primeng/timeline';

@Component({
    selector: 'app-history',
    imports: [
        CommonModule,
        TableModule,
        CardModule,
        ButtonModule,
        TagModule,
        ChartModule,
        TimelineModule
    ],
    templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {
    // Mock data for student history events
    historyEvents = [
        {
            date: '2023-09-01',
            title: 'Enrolled in English Course - Level B2',
            description: 'Student enrolled in the English language course at intermediate level B2.',
            icon: 'pi pi-book',
            color: '#4CAF50'
        },
        {
            date: '2023-08-15',
            title: 'Completed Assessment - Unit 3',
            description: 'Successfully completed the assessment for Unit 3 with a score of 85%.',
            icon: 'pi pi-check-circle',
            color: '#2196F3'
        },
        {
            date: '2023-07-20',
            title: 'Changed Class Schedule',
            description: 'Moved from morning class (9:00 AM) to evening class (6:00 PM).',
            icon: 'pi pi-calendar',
            color: '#FF9800'
        },
        {
            date: '2023-06-10',
            title: 'Missed Class',
            description: 'Absent from class. Reason: Family emergency.',
            icon: 'pi pi-times-circle',
            color: '#F44336'
        },
        {
            date: '2023-05-15',
            title: 'Completed Level A2',
            description: 'Successfully completed Level A2 with an overall score of 92%.',
            icon: 'pi pi-flag',
            color: '#673AB7'
        },
        {
            date: '2023-04-01',
            title: 'Initial Registration',
            description: 'Registered as a new student at the language center.',
            icon: 'pi pi-user-plus',
            color: '#009688'
        }
    ];

    // Chart data for academic performance over time
    performanceData: any;
    performanceOptions: any;

    ngOnInit() {
        // Initialize performance chart data
        this.performanceData = {
            labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [
                {
                    label: 'Assessment Scores',
                    data: [75, 92, 88, 85, 90, 95],
                    fill: false,
                    borderColor: '#42A5F5',
                    tension: 0.4
                },
                {
                    label: 'Attendance Rate',
                    data: [100, 90, 95, 85, 100, 100],
                    fill: false,
                    borderColor: '#66BB6A',
                    tension: 0.4
                }
            ]
        };

        // Configure chart options
        this.performanceOptions = {
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Score / Percentage'
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

    // Helper method to format dates
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}
