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
    evaluations: any[] = []; // This would be populated from a service
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    loading = false;

    constructor(private tableService: TableService<any>) {}

    ngOnInit(): void {
        // Mock data for evaluations
        this.evaluations = [
            {
                id: 1,
                title: 'Midterm Exam',
                class: 'English Beginner',
                date: '2023-03-15',
                type: 'Exam',
                maxScore: 100,
                passingScore: 60,
                status: 'Completed'
            },
            {
                id: 2,
                title: 'Final Project',
                class: 'English Beginner',
                date: '2023-06-01',
                type: 'Project',
                maxScore: 100,
                passingScore: 60,
                status: 'Scheduled'
            },
            {
                id: 3,
                title: 'Vocabulary Quiz',
                class: 'English Intermediate',
                date: '2023-02-10',
                type: 'Quiz',
                maxScore: 50,
                passingScore: 30,
                status: 'Completed'
            },
            {
                id: 4,
                title: 'Grammar Test',
                class: 'Spanish Beginner',
                date: '2023-04-20',
                type: 'Test',
                maxScore: 80,
                passingScore: 48,
                status: 'Completed'
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
                field: 'date',
                header: 'Date',
                filterType: 'date',
            },
            {
                field: 'type',
                header: 'Type',
                filterType: 'text',
            },
            {
                field: 'maxScore',
                header: 'Max Score',
                filterType: 'numeric',
            },
            {
                field: 'passingScore',
                header: 'Passing Score',
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
