import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
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
                redirectTo: 'roles',
                pathMatch: 'full'
            },
            {
                path: 'roles',
                loadComponent: () =>
                    import('./pages/detail/tabs/roles/roles.component').then(c => c.RolesComponent)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EmployeesRoutes {
}
