import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {SelectButtonModule} from "primeng/selectbutton";
import {InvoicesDashboardComponent} from "../invoices/invoices-dashboard.component";
import {PaymentDashboardComponent} from "../payments/payment-dashboard.component";
import {TabViewComponent} from "../../../../shared/components/tables/tab-view/tab-view.component";
import {ViewTabComponent} from "../../../../shared/components/view-tab/view-tab.component";

type ViewOption = { label: string; value: { key: string; component: any } };

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule, SelectButtonModule, TabViewComponent, ViewTabComponent],
    templateUrl: './dashboard.component.html',
})
export class FinanceDashboard implements OnInit {

    viewOptions: ViewOption[] = [
        {label: 'Geral', value: {key: 'general', component: InvoicesDashboardComponent}},
        {label: 'Facturas', value: {key: 'students', component: InvoicesDashboardComponent}},
        {label: 'Pagamentos', value: {key: 'lessons', component: PaymentDashboardComponent}},
    ];

    ngOnInit() {
    }
}
