import {Routes} from '@angular/router';

export const RolesRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/list/list.component').then(c => c.ListComponent)
    },
    {
        path: 'create',
        loadComponent: () =>
            import('./pages/create/create.component').then(c => c.CreateComponent)
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/detail/detail.component').then(c => c.DetailComponent),
        children: [
            {
                path: '',
                redirectTo: 'permissions',
                pathMatch: 'full'
            },
            {
                path: 'permissions',
                loadComponent: () =>
                    import('./pages/detail/permissions/permissions.component').then(c => c.PermissionsComponent)
            }
        ]
    }
];
