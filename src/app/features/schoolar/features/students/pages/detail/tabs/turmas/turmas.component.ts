import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalTable } from 'src/app/shared/components/tables/global-table/global-table.component';
import { TableService } from 'src/app/shared/services/table.service';

@Component({
    selector: 'app-turmas',
    imports: [GlobalTable, CommonModule],
    templateUrl: './turmas.component.html'
})
export class TurmasComponent implements OnInit {
    classes: any[] = [
        {
            id: 1,
            name: 'English Intermediate 1',
            startDate: '2023-01-15',
            endDate: '2023-06-30',
            schedule: 'Mon, Wed 18:00-19:30',
            teacher: 'John Smith',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Spanish Beginner',
            startDate: '2023-02-01',
            endDate: '2023-07-15',
            schedule: 'Tue, Thu 17:00-18:30',
            teacher: 'Maria Rodriguez',
            status: 'Active'
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
                field: 'name',
                header: 'Nome',
                filterType: 'text',
            },
            {
                field: 'startDate',
                header: 'Data Início',
                filterType: 'date',
            },
            {
                field: 'endDate',
                header: 'Data Fim',
                filterType: 'date',
            },
            {
                field: 'schedule',
                header: 'Horário',
                filterType: 'text',
            },
            {
                field: 'teacher',
                header: 'Professor',
                filterType: 'text',
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
