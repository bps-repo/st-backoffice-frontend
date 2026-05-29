import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {DatePickerModule} from 'primeng/datepicker';
import {InvoicesDashboardComponent} from "../invoices/invoices-dashboard.component";
import {PaymentDashboardComponent} from "../payments/payment-dashboard.component";
import {TabViewComponent} from "../../../../shared/components/tables/tab-view/tab-view.component";
import {ViewTabComponent} from "../../../../shared/components/view-tab/view-tab.component";
import {FinanceOverviewDashboardComponent} from "../overview/finance-overview-dashboard.component";
import {SellersDashboardComponent} from "../sellers/sellers-dashboard.component";
import {CenterRevenueDashboardComponent} from "../center-revenue/center-revenue-dashboard.component";
import {SellerEvolutionDashboardComponent} from "../seller-evolution/seller-evolution-dashboard.component";
import {AnalyticsGrowthDashboardComponent} from "../analytics-growth/analytics-growth-dashboard.component";
import {AnalyticsHeatmapDashboardComponent} from "../analytics-heatmap/analytics-heatmap-dashboard.component";
import {AnalyticsCashflowDashboardComponent} from "../analytics-cashflow/analytics-cashflow-dashboard.component";

type ViewOption = { label: string; value: { key: string; component: any } };

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, DatePickerModule, ViewTabComponent],
    template: `
        <app-view-tab [title]="'Dashboard'" [viewOptions]="viewOptions"/>`,
})
export class FinanceDashboard implements OnInit {

    viewOptions: ViewOption[] = [
        {label: 'Geral', value: {key: 'general', component: FinanceOverviewDashboardComponent}},
        {label: 'Facturas', value: {key: 'students', component: InvoicesDashboardComponent}},
        {label: 'Pagamentos', value: {key: 'lessons', component: PaymentDashboardComponent}},
        {label: 'Vendedores', value: {key: 'sellers', component: SellersDashboardComponent}},
        {label: 'Centros',    value: {key: 'centers',         component: CenterRevenueDashboardComponent}},
        {label: 'Consultores', value: {key: 'seller-evolution', component: SellerEvolutionDashboardComponent}},
        {label: 'Crescimento', value: {key: 'analytics-growth',    component: AnalyticsGrowthDashboardComponent}},
        {label: 'Heatmap',     value: {key: 'analytics-heatmap',  component: AnalyticsHeatmapDashboardComponent}},
        {label: 'Fluxo Caixa', value: {key: 'analytics-cashflow', component: AnalyticsCashflowDashboardComponent}},
    ];

    ngOnInit() {
    }
}
