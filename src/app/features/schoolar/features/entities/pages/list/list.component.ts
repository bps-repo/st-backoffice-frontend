import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Company } from 'src/app/core/models/mocks/company';
import { GlobalTable, TableColumn } from 'src/app/shared/components/tables/global-table/global-table.component';
import { COMPANIES } from 'src/app/shared/constants/companies';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-list',
    imports: [CommonModule, GlobalTable, ButtonModule],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit {
    tableLabel = 'Entidades';
    columns: TableColumn[] = [];
    entities: Company[] = COMPANIES;
    loading: boolean = false;

    globalFilterFields: string[] = ['id', 'name', 'phone', 'address', 'students'];

    constructor(private router: Router) {}

    ngOnInit(): void {
        // Simulate loading
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 500);

        // Define columns for the table
        this.columns = [
            {
                field: 'id',
                header: 'Número',
                filterType: 'text',
            },
            {
                field: 'name',
                header: 'Nome',
                filterType: 'text',
            },
            {
                field: 'phone',
                header: 'Telefone',
                filterType: 'text',
            },
            {
                field: 'address',
                header: 'Endereço',
                filterType: 'text',
            },
            {
                field: 'students',
                header: 'Estudantes',
                filterType: 'text',
            },
            {
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    viewDetails(entity: Company): void {
        this.router.navigate(['/schoolar/entities', entity.id]);
    }

    createEntity(): void {
        this.router.navigate(['/schoolar/entities/create']);
    }
}
