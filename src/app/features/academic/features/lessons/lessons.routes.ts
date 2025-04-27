import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
    // {
    //     path: 'create',
    //     component: CreateComponent,
    // },
    // {
    //     path: 'edit/:id',
    //     component: EditComponent,
    // },
    // {
    //     path: ':id',
    //     component: DetailComponent,
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LessonsRoutes {}
