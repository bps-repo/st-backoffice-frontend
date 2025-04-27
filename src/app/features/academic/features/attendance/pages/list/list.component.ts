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
    attendanceRecords: any[] = []; // This would be populated from a service
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    loading = false;

    constructor(private tableService: TableService<any>) {}

    ngOnInit(): void {
        // Mock data for attendance records
        this.attendanceRecords = [
            {
                id: 1,
                date: '2023-06-01',
                studentName: 'John Doe',
                className: 'English Intermediate',
                status: 'Present',
                notes: 'Arrived on time'
            },
            {
                id: 2,
                date: '2023-06-01',
                studentName: 'Jane Smith',
                className: 'English Intermediate',
                status: 'Absent',
                notes: 'Sick leave'
            },
            {
                id: 3,
                date: '2023-06-02',
                studentName: 'John Doe',
                className: 'English Intermediate',
                status: 'Present',
                notes: ''
            },
            {
                id: 4,
                date: '2023-06-02',
                studentName: 'Jane Smith',
                className: 'English Intermediate',
                status: 'Late',
                notes: 'Arrived 15 minutes late'
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
                field: 'date',
                header: 'Date',
                filterType: 'date',
            },
            {
                field: 'studentName',
                header: 'Student',
                filterType: 'text',
            },
            {
                field: 'className',
                header: 'Class',
                filterType: 'text',
            },
            {
                field: 'status',
                header: 'Status',
                filterType: 'text',
            },
            {
                field: 'notes',
                header: 'Notes',
                filterType: 'text',
            }
        ];

        // Populate globalFilterFields
        this.globalFilterFields = this.columns.map(col => col.field);
    }
}
