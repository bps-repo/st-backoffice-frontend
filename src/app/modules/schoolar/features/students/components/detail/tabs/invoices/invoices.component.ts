import { Component } from '@angular/core';
import { Invoice } from 'src/app/core/models/invoice';

@Component({
    selector: 'app-invoices',
    standalone: true,
    imports: [],
    templateUrl: './invoices.component.html',
    styleUrl: './invoices.component.scss',
})
export class InvoicesComponent {
    columns: any[] = [];

    invoices: Partial<Invoice>[] = [];

    constructor() {}

    ngOnInit(): void {
        this.columns = [
            { field: 'code', header: 'Factura' },
            { field: 'name', header: 'Valor' },
            { field: 'price', header: 'Preço' },
            { field: 'date', header: 'Data de Emissão' },
            { field: 'date', header: 'Data de Vencimento' },
            { field: 'status', header: 'Estado' },
        ];
    }
}
