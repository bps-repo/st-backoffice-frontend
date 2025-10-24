import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './pages/detail/detail.component';
import { ListComponent } from './pages/list/list.component';
import { CreateLevelComponent } from './pages/create/create-level.component';

const routes: Routes = [
        {
            path: '',
            component: ListComponent,
        },
        {
            path: 'create',
            component: CreateLevelComponent,
        },
        {
            path: ':id',
            component: DetailComponent,
        },
    ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LevelsRoutes{}
