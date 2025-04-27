import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [
        CommonModule,
        TabViewModule,
        ButtonModule,
        CardModule,
        TableModule,
        TagModule
    ],
    templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
    classId: string | null = null;
    class: any = {
        id: 1,
        name: 'English Beginner',
        code: 'ENG101',
        level: 'Beginner',
        teacher: 'John Smith',
        startDate: '2023-01-15',
        endDate: '2023-06-30',
        schedule: 'Mon, Wed 18:00-19:30',
        capacity: 15,
        enrolled: 12,
        status: 'Active',
        students: [
            { id: 1, name: 'John Doe', email: 'john.doe@example.com', enrollmentDate: '2023-01-10' },
            { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', enrollmentDate: '2023-01-12' },
            { id: 3, name: 'Michael Johnson', email: 'michael.johnson@example.com', enrollmentDate: '2023-01-15' }
        ],
        lessons: [
            { id: 1, title: 'Introduction to English Grammar', date: '2023-01-15', status: 'Completed' },
            { id: 2, title: 'Basic Conversation Practice', date: '2023-01-22', status: 'Completed' },
            { id: 3, title: 'Present Tense Verbs', date: '2023-01-29', status: 'Scheduled' }
        ]
    };

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.classId = this.route.snapshot.paramMap.get('id');
        // In a real application, you would fetch the class data from a service
        // this.classService.getClass(this.classId).subscribe(data => {
        //     this.class = data;
        // });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'Active':
                return 'success';
            case 'Inactive':
                return 'warning';
            case 'Completed':
                return 'info';
            case 'Cancelled':
                return 'danger';
            default:
                return 'info';
        }
    }
}
