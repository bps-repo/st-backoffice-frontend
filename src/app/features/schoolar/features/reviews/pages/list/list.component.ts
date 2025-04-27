import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import { EXAMS } from 'src/app/shared/constants/exams';
import { Exam } from 'src/app/core/models/academic/exam';

@Component({
    selector: 'app-list',
    imports: [CommonModule, GlobalTable],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit {
    exams: Exam[] = EXAMS;
    loading = false;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['name', 'date', 'class', 'level', 'teacher'];

    constructor(private router: Router) {}

    ngOnInit(): void {
        // Define columns for the table
        this.columns = [
            {
                field: 'name',
                header: 'Id',
                filterType: 'text',
            },
            {
                field: 'date',
                header: 'Data',
                filterType: 'text',
            },
            {
                field: 'class',
                header: 'Turma',
                filterType: 'text',
            },
            {
                field: 'level',
                header: 'Nível',
                filterType: 'text',
            },
            {
                field: 'teacher',
                header: 'Professor',
                filterType: 'text',
            },
            {
                field: 'reading',
                header: 'Média',
                filterType: 'numeric',
                customTemplate: true,
            },
            {
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    viewDetails(exam: Exam): void {
        // Navigate to the detail page with the exam name as the ID
        // In a real app, you would use a unique ID
        this.router.navigate(['/schoolar/reviews', exam.name]);
    }

    createReview(): void {
        // Navigate to create page
        this.router.navigate(['/schoolar/reviews/create']);
    }
}
