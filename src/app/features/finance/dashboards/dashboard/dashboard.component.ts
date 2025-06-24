import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {SelectButtonModule} from "primeng/selectbutton";
import {InvoicesDashboardComponent} from "../invoices/invoices-dashboard.component";
import {PaymentDashboardComponent} from "../payments/payment-dashboard.component";

type ViewOption = { label: string; value: { key: string; component: any } };

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule, SelectButtonModule],
    templateUrl: './dashboard.component.html',
})
export class FinanceDashboard implements OnInit {

    viewOptions: ViewOption[] = [
        {label: 'Geral', value: {key: 'general', component: InvoicesDashboardComponent}},
        {label: 'Facturas', value: {key: 'students', component: InvoicesDashboardComponent}},
        {label: 'Pagamentos', value: {key: 'lessons', component: PaymentDashboardComponent}},
    ];

    selectedView!: ViewOption;

    ngOnInit() {
        const savedViewKey = localStorage.getItem('selectedViewKey');
        this.selectedView = this.viewOptions.find(view => view.value.key === savedViewKey) || this.viewOptions[0];
    }

    changeView() {
        localStorage.setItem('selectedViewKey', this.selectedView.value.key);
    }

    get getSelectedComponent() {
        return this.selectedView.value.component;
    }
}
