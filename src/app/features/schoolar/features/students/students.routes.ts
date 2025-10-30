import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/list/list.component').then(c => c.ListComponent)
    },
    {
        path: 'add-to-center',
        loadComponent: () =>
            import('./pages/add-to-center/add-to-center.component').then(c => c.AddToCenterComponent)
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
