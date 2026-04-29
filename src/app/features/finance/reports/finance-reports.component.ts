import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewTabComponent} from "../../../shared/components/view-tab/view-tab.component";
import { ContractsReportComponent } from './contracts/contracts-report.component';
import { CustomersReportComponent } from './customers/customers-report.component';
import { InvoicesReportComponent } from './invoices/invoices-report.component';
import { SellersReportComponent } from './sellers/sellers-report.component';

@Component({
    selector: 'app-reports-dashboard',
    standalone: true,
    imports: [CommonModule, ViewTabComponent],
    template: `
        <app-view-tab [title]="'Relatórios'" [viewOptions]="viewOptions"/>`,
})
export class FinanceReportsComponent {
    viewOptions = [
        { label: 'Contratos', value: { key: 'contracts', component: ContractsReportComponent } },
        { label: 'Clientes', value: { key: 'customers', component: CustomersReportComponent } },
        { label: 'Faturas', value: { key: 'invoices', component: InvoicesReportComponent } },
        { label: 'Vendedores', value: { key: 'sellers', component: SellersReportComponent } },
        {label: 'Geral', value: {key: 'general', component: null}},
        {label: 'Pagamentos', value: {key: 'payments', component: null}},
        {label: 'Configurações', value: {key: 'settings', component: null}},
    ];
}
