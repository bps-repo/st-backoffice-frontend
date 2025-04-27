import {Routes} from '@angular/router';

export const FeaturesRoutes: Routes = [
    {
        path: 'schoolar',
        loadChildren: () =>
            import('./schoolar/schoolar.routes').then((m) => m.SCHOOLAR_ROUTES),
    },
    {
        path: 'academic',
        loadChildren: () =>
            import('./academic/academic.routes').then((m) => m.AcademicRoutes),
    },
    {
        path: 'courses',
        loadChildren: () =>
            import('./courses/courses.routes').then((m) => m.CoursesRoutes),
    },
    {
        path: 'comunication',
        loadChildren: () =>
            import('./comunication/comunication.routes').then(
                (m) => m.ComunicationRoutes
            ),
    },
    {
        path: 'settings',
        loadChildren: () =>
            import('./settings/settings-routing.module').then((m) => m.SettingsRoutingModule),
    },
    {
        path: 'human-resources',
        loadChildren: () =>
            import('./human-resources/human-resources.routes').then(
                (m) => m.HumanResourcesRoutes
            ),
    },
    {
        path: 'invoices',
        loadChildren: () =>
            import('./invoices/invoices.routes').then((m) => m.InvoicesRoutes),
    },
];
