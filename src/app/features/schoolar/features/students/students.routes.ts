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
        path: 'add-to-center',
        loadComponent: () =>
            import('./pages/add-to-center/add-to-center.component').then(c => c.AddToCenterComponent)
    },
    {
        path: 'add-to-class',
        loadComponent: () =>
            import('./pages/add-to-class/add-to-class.component').then(c => c.AddToClassComponent)
    },
    {
        path: 'create-contract',
        loadComponent: () =>
            import('./pages/create-contract/create-contract.component').then(c => c.CreateContractComponent)
    },
    {
        path: 'unit-progress',
        loadComponent: () =>
            import('./pages/unit-progress/unit-progress.component').then(c => c.UnitProgressComponent)
    },
    {
        path: 'bulk-actions',
        loadComponent: () =>
            import('./pages/bulk-actions/bulk-actions.component').then(c => c.BulkActionsComponent)
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/detail/detail.component').then(c => c.DetailComponent),
        children: [
            {
                path: '',
                redirectTo: 'info',
                pathMatch: 'full'
            },
            {
                path: 'courses',
                loadComponent: () =>
                    import('./pages/detail/tabs/courses/courses.component').then(c => c.CoursesComponent)
            },
            {
                path: 'invoices',
                loadComponent: () =>
                    import('./pages/detail/tabs/invoices/invoices.component').then(c => c.InvoicesComponent)
            },
            {
                path: 'unit-progress',
                loadComponent: () =>
                    import('./pages/detail/tabs/unit-progress/unit-progress.component').then(c => c.UnitProgressTabComponent)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudentsRoutes {
}
