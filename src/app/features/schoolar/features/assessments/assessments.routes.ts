import { Routes } from '@angular/router';

export const AssessmentsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/list/list.component').then((m) => m.ListComponent),
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./pages/edit/edit.component').then((m) => m.EditComponent),
    },
    {
        path: 'attempt/:id',
        loadComponent: () => import('./pages/attempt/attempt.component').then((m) => m.AttemptComponent),
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/detail/detail.component').then((m) => m.DetailComponent),
    },
];
