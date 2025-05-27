import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClassComponent} from './pages/list/class.component';
import {ClassCreateComponent} from './pages/create/class-create.component';
import {ClassEditComponent} from './pages/edit/class-edit.component';
import {ClassDetailComponent} from './pages/detail/class-detail.component';
import {ClassesDashboardComponent} from './pages/dashboard/dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: ClassComponent,
    },
    {
        path: 'dashboard',
        component: ClassesDashboardComponent,
    },
    {
        path: 'create',
        component: ClassCreateComponent,
    },
    {
        path: 'edit/:id',
        component: ClassEditComponent,
    },
    {
        path: ':id',
        component: ClassDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassesRoutes {
}
