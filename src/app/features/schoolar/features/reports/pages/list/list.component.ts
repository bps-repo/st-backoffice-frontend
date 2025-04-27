import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';

interface Report {
    id: string;
    name: string;
    type: string;
    generatedDate: string;
    generatedBy: string;
    status: string;
}

@Component({
    selector: 'app-list',
    imports: [CommonModule, GlobalTable],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit {
    reports: Report[] = [
        {
            id: '1',
            name: 'Student Performance Report',
            type: 'Performance',
            generatedDate: '2023-01-15',
            generatedBy: 'Admin User',
            status: 'Generated'
        },
        {
            id: '2',
            name: 'Class Attendance Report',
            type: 'Attendance',
            generatedDate: '2023-02-20',
            generatedBy: 'Admin User',
            status: 'Generated'
        },
        {
            id: '3',
            name: 'Financial Summary Report',
            type: 'Financial',
            generatedDate: '2023-03-10',
            generatedBy: 'Admin User',
            status: 'Pending'
        }
    ];
    loading = false;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['id', 'name', 'type', 'generatedDate', 'generatedBy', 'status'];

    constructor(private router: Router) {}

    ngOnInit(): void {
        // Define columns for the table
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
                field: 'type',
                header: 'Tipo',
                filterType: 'text',
            },
            {
                field: 'generatedDate',
                header: 'Data de Geração',
                filterType: 'text',
            },
            {
                field: 'generatedBy',
                header: 'Gerado Por',
                filterType: 'text',
            },
            {
                field: 'status',
                header: 'Estado',
                filterType: 'text',
                customTemplate: true,
            },
            {
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    viewDetails(report: Report): void {
        this.router.navigate(['/schoolar/reports', report.id]);
    }

    generateReport(): void {
        // In a real app, this would open a dialog to generate a new report
        console.log('Generate new report');
        alert('Report generation started');
    }
}
