import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from './pages/list/list.component';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
    // {
    //   path: 'create',
    //   loadComponent: () => import('./pages/create/create.component').then(m => m.CreateComponent),
    // },
    // {
    //   path: 'detail/:id',
    //   loadComponent: () => import('./pages/detail/detail.component').then(m => m.DetailComponent),
    // },
    // {
    //   path: 'edit/:id',
    //   loadComponent: () => import('./pages/edit/edit.component').then(m => m.EditComponent),
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsRoutes {
}
