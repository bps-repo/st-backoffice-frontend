import { Component } from '@angular/core';
import { Invoice } from 'src/app/core/models/invoice';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import {
    GlobalTableComponent,
    TableColumn,
} from 'src/app/shared/components/global-table/global-table.component';

@Component({
    selector: 'app-invoices',
    standalone: true,
    imports: [GlobalTableComponent],
    templateUrl: './invoices.component.html',
    styleUrl: './invoices.component.scss',
})
export class InvoicesComponent {
    columns: TableColumn[] = [];

    invoices: Partial<Invoice>[] = [];

    constructor(private invoiceService: InvoiceService) {}

    ngOnInit(): void {
        this.loadInvoices();
        this.columns = [
            { field: 'code', header: 'Factura' },
            { field: 'price', header: 'Preço' },
            { field: 'date', header: 'Data de Emissão' },
            { field: 'dueDate', header: 'Data de Vencimento' },
            { field: 'status', header: 'Estado' },
            { field: 'action', header: 'Acções' },
        ];
    }

    private loadInvoices(): void {
        this.invoiceService.getInvoices().subscribe((invoices) => {
            this.invoices = invoices;
        });
    }
}
