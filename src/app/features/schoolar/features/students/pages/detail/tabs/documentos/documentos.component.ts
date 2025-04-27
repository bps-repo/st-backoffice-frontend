import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { TableService } from 'src/app/shared/services/table.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-documentos',
    standalone: true,
    imports: [TableWithFiltersComponent, CommonModule, ButtonModule],
    templateUrl: './documentos.component.html',
})
export class DocumentosComponent implements OnInit {
    documents: any[] = [
        {
            id: 1,
            name: 'Enrollment Form',
            type: 'PDF',
            uploadDate: '2023-01-10',
            size: '1.2 MB',
            status: 'Approved'
        },
        {
            id: 2,
            name: 'ID Card Copy',
            type: 'JPG',
            uploadDate: '2023-01-10',
            size: '0.8 MB',
            status: 'Approved'
        },
        {
            id: 3,
            name: 'Certificate of Completion - Beginner Level',
            type: 'PDF',
            uploadDate: '2022-12-15',
            size: '0.5 MB',
            status: 'Issued'
        },
        {
            id: 4,
            name: 'Payment Receipt - January 2023',
            type: 'PDF',
            uploadDate: '2023-01-05',
            size: '0.3 MB',
            status: 'Processed'
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
                field: 'type',
                header: 'Tipo',
                filterType: 'text',
            },
            {
                field: 'uploadDate',
                header: 'Data de Upload',
                filterType: 'date',
            },
            {
                field: 'size',
                header: 'Tamanho',
                filterType: 'text',
            },
            {
                field: 'status',
                header: 'Status',
                filterType: 'text',
            },
            {
                field: 'actions',
                header: 'Ações',
                filterType: 'none',
            }
        ];

        // Populate globalFilterFields
        this.globalFilterFields = this.columns
            .filter(col => col.field !== 'actions')
            .map(col => col.field);
    }

    downloadDocument(document: any) {
        console.log('Downloading document:', document);
        // In a real application, this would trigger a download
    }
}
