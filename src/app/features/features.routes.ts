import {Routes} from '@angular/router';

export const FeaturesRoutes: Routes = [
    {
        path: 'schoolar',
        loadChildren: () =>
            import('./schoolar/SCHOOLAR_ROUTES').then((m) => m.SCHOOLAR_ROUTES),
    },
    {
        path: 'settings',
        loadChildren: () =>
            import('./settings/SETTINGS_ROUTES').then((m) => m.SETTINGS_ROUTES),
    },
    {
        path: 'corporate',
        loadChildren: () =>
            import('./corporate/CORPORATE_ROUTES').then((m) => m.CORPORATE_ROUTES),
    },
    {
        path: 'finances',
        loadChildren: () =>
            import('./finance/finances.routes').then((m) => m.FINANCES_ROUTES),
    },
];
