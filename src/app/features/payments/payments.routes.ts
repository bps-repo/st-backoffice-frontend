import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DashboardRoutes),
  },
  {
    path: 'installments',
    loadChildren: () => import('./features/installments/installments.routes').then(m => m.InstallmentsRoutes),
  },
  // {
  //   path: 'reports',
  //   loadChildren: () => import('./features/reports/reports.routes').then(m => m.ReportsRoutes),
  // },
  // {
  //   path: 'settings',
  //   loadChildren: () => import('./features/settings/settings.routes').then(m => m.SettingsRoutes),
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutes {}
