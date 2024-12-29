import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableInvoicesComponent } from 'src/app/shared/components/table-invoices/table-invoices.component';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableInvoicesComponent, CommonModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent {}
