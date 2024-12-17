import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcommerceDashboardComponent } from 'src/app/demo/components/dashboards/ecommerce/ecommerce.dashboard.component';
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'classes',
    },
    {
        path: 'students',
    },
    {
        path: 'registrations',
    },
    {
        path: 'reports',
    },
    {
        path: 'timetables',
    },
    {
        path: 'settings',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FeaturesRoutingModule {}
