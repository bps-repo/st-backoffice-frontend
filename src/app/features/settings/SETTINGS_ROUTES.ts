import {Routes} from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
    {
        path: 'profile',
        loadComponent: () =>
            import('./features/profile/pages/profile/profile.component').then((m) => m.ProfileComponent),
    },
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
    },
    {
        path: 'tasks',
        loadChildren: () =>
            import('./features/tasks/tasks.routes').then((m) => m.TasksRoutes),
    }
];
