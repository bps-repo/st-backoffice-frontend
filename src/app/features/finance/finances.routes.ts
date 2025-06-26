import {Routes} from "@angular/router";
import {FinanceDashboard} from "./dashboards/dashboard/dashboard.component";
import {FinanceReportsComponent} from "./reports/finance-reports.component";
import {FinanceSettingsComponent} from "./settings/finance-settings.component";

export const FINANCES_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'dashboards',
                pathMatch: 'full',
            },
            {
                path: 'dashboards',
                component: FinanceDashboard,
            },
            {
                path: 'invoices',
                loadChildren: () =>
                    import('./invoices/invoices.routes').then(m => m.InvoicesRoutes),
            },
            {
                path: 'payments',
                loadChildren: () =>
                    import('./payments/payments.routes').then(m => m.PaymentsRoutes),
            },
            {
                path: 'contracts',
                loadChildren: () =>
                    import('./contracts/contracts.routes').then(m => m.ContractsRoutes),
            },
            {
                path: 'settings',
                component: FinanceSettingsComponent,
            },
            {
                path: 'reports',
                component: FinanceReportsComponent
            }
        ]
    }
]
