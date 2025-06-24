import {Routes} from '@angular/router';
import {CorporateSettingsComponent} from "./settings/corporate-settings.component";
import {CorporateReportsComponent} from "./reports/corporate-reports.component";
import {CorporateDashboard} from "./dashboard/dashboard.component";

export const CORPORATE_ROUTES: Routes = [
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
                component: CorporateDashboard,
            },
            {
                path: 'centers',
                loadChildren: () =>
                    import('./features/ centers/centers.routes').then((m) => m.CentersRoutes),
            },
            {
                path: 'settings',
                component: CorporateSettingsComponent,
            },
            {
                path: 'reports',
                component: CorporateReportsComponent,
            },
        ]
    }
];

