import {Routes} from '@angular/router';

export const CompaniesRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/list/list.component').then((m) => m.ListComponent),
    },
];
