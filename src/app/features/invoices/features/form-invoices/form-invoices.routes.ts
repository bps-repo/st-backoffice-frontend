import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';

const routes: Routes = [

        {
                path: '',
                component: ListComponent,
        },
        {
                path: 'create',
                component: CreateComponent,
            }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FormInvoicesRoutes {}
