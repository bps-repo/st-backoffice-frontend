import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';

const routes: Routes = [
    {
        path: '',
        component: TasksComponent,
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/detail/detail.component').then((m) => m.TaskDetailComponent),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TasksRoutes {}
