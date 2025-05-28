import {Routes} from '@angular/router';

export const FeaturesRoutes: Routes = [
    {
        path: 'schoolar',
        loadChildren: () =>
            import('./schoolar/schoolar.routes').then((m) => m.SchoolarRoutes),
    },
    {
        path: 'courses',
        loadChildren: () =>
            import('./courses/courses.routes').then((m) => m.CoursesRoutes),
    },
    {
        path: 'settings',
        loadChildren: () =>
            import('./settings/settings.routes').then((m) => m.SettingsRoutes),
    },
    {
        path: 'corporate',
        loadChildren: () =>
            import('./corporate/corporate.routes').then((m) => m.CorporateRoutes),
    },
    {
        path: 'invoices',
        loadChildren: () =>
            import('./invoices/invoices.routes').then((m) => m.InvoicesRoutes),
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./admin/admin.routes').then((m) => m.AdminRoutes),
    },
];
