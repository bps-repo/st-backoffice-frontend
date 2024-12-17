import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { DetailComponent } from './components/detail/detail.component';
import { ProfileCreateComponent } from 'src/app/demo/components/profile/create/profilecreate.component';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
    {
        path: 'create',
        component: ProfileCreateComponent,
    },
    {
        path: 'edit/:id',
        component: EditComponent,
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
export class StudentsRoutingModule {}
