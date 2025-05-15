import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';

const routes: Routes = [
    {
            path: '',
                    children: [
                        {
                            path: '',
                            redirectTo: 'dashboard',
                            pathMatch: 'full',
                        },
                        {
                            path: 'dashboard',
                            component: DashboardComponent,
                        },
                        {
                        path: 'invoices',
                            loadChildren: () =>
                            import('../invoices/features/form-invoices/form-invoices.routes').then((m) => m.FormInvoicesRoutes),
                 },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutes { }
