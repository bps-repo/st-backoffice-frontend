import { Routes } from '@angular/router';

export const ServicesRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/list/list.component').then((c) => c.ListComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/detail/detail.component').then((c) => c.DetailComponent),
    },
];
