import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableColumn,
    TableWithFiltersComponent,
} from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { TableService } from 'src/app/shared/services/table.service';

@Component({
    selector: 'app-list',
    imports: [TableWithFiltersComponent, CommonModule],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    classes: any[] = []; // This would be populated from a service
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    loading = false;

    constructor(private tableService: TableService<any>) {}

    ngOnInit(): void {
        // Mock data for classes
        this.classes = [
            {
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
                status: 'Active'
            },
            {
                id: 2,
                name: 'English Intermediate',
                code: 'ENG201',
                level: 'Intermediate',
                teacher: 'Jane Doe',
                startDate: '2023-01-15',
                endDate: '2023-06-30',
                schedule: 'Tue, Thu 18:00-19:30',
                capacity: 15,
                enrolled: 10,
                status: 'Active'
            },
            {
                id: 3,
                name: 'Spanish Beginner',
                code: 'SPA101',
                level: 'Beginner',
                teacher: 'Maria Rodriguez',
                startDate: '2023-02-01',
                endDate: '2023-07-15',
                schedule: 'Mon, Wed 17:00-18:30',
                capacity: 12,
                enrolled: 8,
                status: 'Active'
            },
            {
                id: 4,
                name: 'French Beginner',
                code: 'FRE101',
                level: 'Beginner',
                teacher: 'Pierre Dupont',
                startDate: '2023-02-15',
                endDate: '2023-07-30',
                schedule: 'Tue, Thu 17:00-18:30',
                capacity: 12,
                enrolled: 6,
                status: 'Active'
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
                field: 'name',
                header: 'Name',
                filterType: 'text',
            },
            {
                field: 'code',
                header: 'Code',
                filterType: 'text',
            },
            {
                field: 'level',
                header: 'Level',
                filterType: 'text',
            },
            {
                field: 'teacher',
                header: 'Teacher',
                filterType: 'text',
            },
            {
                field: 'schedule',
                header: 'Schedule',
                filterType: 'text',
            },
            {
                field: 'enrolled',
                header: 'Enrolled',
                filterType: 'numeric',
            },
            {
                field: 'capacity',
                header: 'Capacity',
                filterType: 'numeric',
            },
            {
                field: 'status',
                header: 'Status',
                filterType: 'text',
            }
        ];

        // Populate globalFilterFields
        this.globalFilterFields = this.columns.map(col => col.field);
    }
}
