import {Routes} from "@angular/router";
import {FinanceDashboard} from "./dashboards/dashboard/dashboard.component";

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
            }
        ]
    }
]
