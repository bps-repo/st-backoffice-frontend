import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';

interface Certificate {
    id: string;
    name: string;
    student: string;
    course: string;
    issueDate: string;
    status: string;
}

@Component({
    selector: 'app-list',
    imports: [CommonModule, GlobalTable],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit {
    certificates: Certificate[] = [
        {
            id: '1',
            name: 'Certificate of Completion',
            student: 'John Doe',
            course: 'English Level 1',
            issueDate: '2023-01-15',
            status: 'Issued'
        },
        {
            id: '2',
            name: 'Certificate of Achievement',
            student: 'Jane Smith',
            course: 'Mathematics Advanced',
            issueDate: '2023-02-20',
            status: 'Pending'
        },
        {
            id: '3',
            name: 'Certificate of Excellence',
            student: 'Bob Johnson',
            course: 'Science Fundamentals',
            issueDate: '2023-03-10',
            status: 'Issued'
        }
    ];
    loading = false;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['id', 'name', 'student', 'course', 'issueDate', 'status'];

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
                field: 'student',
                header: 'Aluno',
                filterType: 'text',
            },
            {
                field: 'course',
                header: 'Curso',
                filterType: 'text',
            },
            {
                field: 'issueDate',
                header: 'Data de Emissão',
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

    viewDetails(certificate: Certificate): void {
        this.router.navigate(['/schoolar/certificates', certificate.id]);
    }

    createCertificate(): void {
        this.router.navigate(['/schoolar/certificates/create']);
    }
}
