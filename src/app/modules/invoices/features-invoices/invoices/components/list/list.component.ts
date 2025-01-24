import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    GlobalTableComponent,
    TableColumn,
} from 'src/app/shared/components/global-table/global-table.component';
import { Invoice } from 'src/app/core/models/invoice';
import { InvoiceService } from 'src/app/core/services/invoice.service';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
    columns: TableColumn[] = [];

    invoices: Invoice[] = [];

    constructor(private invoiceService: InvoiceService) {}

    ngOnInit(): void {
        this.loadInvoices();
        this.columns = [
            { field: 'code', header: 'Factura' },
            { field: 'price', header: 'Preço' },
            { field: `customer.id`, header: 'Cliente' },
            { field: 'date', header: 'Data de Emissão' },
            { field: 'dueDate', header: 'Data de Vencimento' },
            { field: 'status', header: 'Estado' },
            { field: 'actions', header: 'Acções' },
        ];
    }

    private loadInvoices(): void {
        this.invoiceService.getInvoices().subscribe((invoices) => {
            this.invoices = invoices;
        });
    }
}
