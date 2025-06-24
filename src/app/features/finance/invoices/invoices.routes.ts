import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';

const routes: Routes = [
    {
            path: '',
                    children: [
                        {
                            path: '',
                            redirectTo: 'students-materials-dashboard',
                            pathMatch: 'full',
                        },
                        {
                            path: 'students-materials-dashboard',
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
