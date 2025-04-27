import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableInvoicesComponent } from 'src/app/shared/components/tables/table-invoices/table-invoices.component';

@Component({
    selector: 'app-list',
    imports: [TableInvoicesComponent, CommonModule],
    templateUrl: './list.component.html'
})
export class ListComponent {}
