import {Routes} from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
    {
        path: 'alerts',
        loadChildren: () =>
            import('./features/alerts/alerts.routes').then((m) => m.AlertsRoutes),
    },
    {
        path: 'support',
        loadChildren: () =>
            import('./features/support/support.routes').then((m) => m.SupportRoutes),
    },
    {
        path: 'general-info',
        loadChildren: () =>
            import('./features/general-info/general-info.routes').then((m) => m.GeneralInfoRoutes),
    }
];
