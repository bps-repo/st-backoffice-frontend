import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './features/dashboard/components/dashboard/dashboard.component';

export const CORPORATE_ROUTES: Routes = [
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
                path: 'centers',
                loadChildren: () =>
                    import('./features/ centers/centers.routes').then((m) => m.CentersRoutes),
            },
        ]
    }
];

