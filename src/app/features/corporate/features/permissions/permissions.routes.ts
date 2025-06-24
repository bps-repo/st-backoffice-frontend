import {Routes} from "@angular/router";

export const PermissionsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/list/list.component').then(c => c.ListComponent)
    },
];
