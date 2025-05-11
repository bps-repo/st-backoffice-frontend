import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../schoolar/features/dashboard/components/dashboard/dashboard.component';

export const CorporateRoutes: Routes = [
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
                        path: 'centers',
                        loadChildren: () =>
                            import('./features/ centers/centers.routes').then((m) => m.CentersRoutes),
                    },
                ]
    }
];

