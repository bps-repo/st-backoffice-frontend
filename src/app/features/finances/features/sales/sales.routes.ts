import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { CreateComponent } from './pages/create/create.component';
import { EditComponent } from './pages/edit/edit.component';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
    {
        path: 'create',
        component: CreateComponent,
    },
    {
        path: ':id',
        component: DetailComponent,
    },
    {
        path: ':id/edit',
        component: EditComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SalesRoutes {}
