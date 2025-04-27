import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import { EXAMS } from 'src/app/shared/constants/exams';
import { Exam } from 'src/app/core/models/academic/exam';

@Component({
    selector: 'app-list',
    imports: [CommonModule, GlobalTable],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    exams: Exam[] = EXAMS;
    loading = false;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['name', 'date', 'class', 'level', 'teacher'];

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
        ];
    }
}
