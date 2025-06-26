import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewTabComponent} from "../../../shared/components/view-tab/view-tab.component";
import {PaymentComponent} from "../../../shared/components/uikit/menus/payment.component";
import {PaymentSettingsComponent} from "./payment/payment-settings.component";

@Component({
    selector: 'app-reports-dashboard',
    standalone: true,
    imports: [CommonModule, ViewTabComponent],
    template: `
        <app-view-tab [title]="'Definições'" [viewOptions]="viewOptions"/>
    `,
})
export class FinanceSettingsComponent {
    viewOptions = [
        {label: 'Geral', value: {key: 'general', component: null}},
        {label: 'Facturas', value: {key: 'invoices', component: null}},
        {label: 'Pagamentos', value: {key: 'payments', component: PaymentSettingsComponent}},
        {label: 'Configurações', value: {key: 'settings', component: null}},
    ];
}
