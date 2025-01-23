import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { Invoice } from 'src/app/core/models/invoice';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
    columns: any[] = [];

    invoices: Invoice[] = [];

    constructor() {}

    ngOnInit(): void {
        this.columns = [
            { field: 'id', header: 'Factura' },
            { field: 'name', header: 'Valor' },
            { field: 'price', header: 'Preço' },
            { field: 'date', header: 'Cliente' },
            { field: 'date', header: 'Data de Emissão' },
            { field: 'date', header: 'Data de Vencimento' },
            { field: 'status', header: 'Estado' },
        ];
    }
}
