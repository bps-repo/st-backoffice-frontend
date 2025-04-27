import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableColumn,
    TableWithFiltersComponent,
} from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { TableService } from 'src/app/shared/services/table.service';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableWithFiltersComponent, CommonModule],
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    lessons: any[] = []; // This would be populated from a service
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    loading = false;

    constructor(private tableService: TableService<any>) {}

    ngOnInit(): void {
        // Mock data for lessons
        this.lessons = [
            {
                id: 1,
                title: 'Introduction to English Grammar',
                class: 'English Beginner',
                teacher: 'John Smith',
                date: '2023-06-01',
                startTime: '18:00',
                endTime: '19:30',
                status: 'Completed',
                attendance: '12/15'
            },
            {
                id: 2,
                title: 'Basic Conversation Practice',
                class: 'English Beginner',
                teacher: 'John Smith',
                date: '2023-06-03',
                startTime: '18:00',
                endTime: '19:30',
                status: 'Completed',
                attendance: '14/15'
            },
            {
                id: 3,
                title: 'Present Tense Verbs',
                class: 'English Beginner',
                teacher: 'John Smith',
                date: '2023-06-08',
                startTime: '18:00',
                endTime: '19:30',
                status: 'Completed',
                attendance: '13/15'
            },
            {
                id: 4,
                title: 'Past Tense Verbs',
                class: 'English Beginner',
                teacher: 'John Smith',
                date: '2023-06-10',
                startTime: '18:00',
                endTime: '19:30',
                status: 'Scheduled',
                attendance: '0/15'
            }
        ];

        // Define custom column templates for different filter types
        this.columns = [
            {
                field: 'id',
                header: 'ID',
                filterType: 'text',
            },
            {
                field: 'title',
                header: 'Title',
                filterType: 'text',
            },
            {
                field: 'class',
                header: 'Class',
                filterType: 'text',
            },
            {
                field: 'teacher',
                header: 'Teacher',
                filterType: 'text',
            },
            {
                field: 'date',
                header: 'Date',
                filterType: 'date',
            },
            {
                field: 'startTime',
                header: 'Start Time',
                filterType: 'text',
            },
            {
                field: 'endTime',
                header: 'End Time',
                filterType: 'text',
            },
            {
                field: 'status',
                header: 'Status',
                filterType: 'text',
            },
            {
                field: 'attendance',
                header: 'Attendance',
                filterType: 'text',
            }
        ];

        // Populate globalFilterFields
        this.globalFilterFields = this.columns.map(col => col.field);
    }
}
