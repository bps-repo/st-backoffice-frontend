import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewTabComponent} from "../../../shared/components/view-tab/view-tab.component";

@Component({
    selector: 'app-reports-dashboard',
    standalone: true,
    imports: [CommonModule, ViewTabComponent],
    template: `
        <app-view-tab [title]="'Relatórios'" [viewOptions]="viewOptions"/>`,
})
export class FinanceReportsComponent {
    viewOptions = [
        {label: 'Geral', value: {key: 'general', component: null}},
        {label: 'Facturas', value: {key: 'invoices', component: null}},
        {label: 'Pagamentos', value: {key: 'payments', component: null}},
        {label: 'Configurações', value: {key: 'settings', component: null}},
    ];
}
