import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalTable } from 'src/app/shared/components/tables/global-table/global-table.component';
import { TableService } from 'src/app/shared/services/table.service';

@Component({
    selector: 'app-avaliacoes',
    imports: [GlobalTable, CommonModule],
    templateUrl: './avaliacoes.component.html'
})
export class AvaliacoesComponent implements OnInit {
    evaluations: any[] = [
        {
            id: 1,
            title: 'Midterm Exam',
            date: '2023-03-15',
            score: 85,
            maxScore: 100,
            grade: 'B',
            subject: 'English Grammar',
            teacher: 'John Smith'
        },
        {
            id: 2,
            title: 'Final Project',
            date: '2023-05-20',
            score: 92,
            maxScore: 100,
            grade: 'A',
            subject: 'English Conversation',
            teacher: 'Jane Doe'
        },
        {
            id: 3,
            title: 'Vocabulary Quiz',
            date: '2023-02-10',
            score: 78,
            maxScore: 100,
            grade: 'C',
            subject: 'English Vocabulary',
            teacher: 'John Smith'
        }
    ];

    columns: any[] = [];
    globalFilterFields: string[] = [];

    constructor(private tableService: TableService<any>) {}

    ngOnInit(): void {
        // Define custom column templates for different filter types
        this.columns = [
            {
                field: 'id',
                header: 'ID',
                filterType: 'text',
            },
            {
                field: 'title',
                header: 'Título',
                filterType: 'text',
            },
            {
                field: 'date',
                header: 'Data',
                filterType: 'date',
            },
            {
                field: 'score',
                header: 'Pontuação',
                filterType: 'numeric',
            },
            {
                field: 'maxScore',
                header: 'Pontuação Máxima',
                filterType: 'numeric',
            },
            {
                field: 'grade',
                header: 'Nota',
                filterType: 'text',
            },
            {
                field: 'subject',
                header: 'Disciplina',
                filterType: 'text',
            },
            {
                field: 'teacher',
                header: 'Professor',
                filterType: 'text',
            }
        ];

        // Populate globalFilterFields
        this.globalFilterFields = this.columns.map(col => col.field);
    }
}
