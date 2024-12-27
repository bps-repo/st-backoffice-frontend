import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { InvoicesCreateComponent } from './components/create/invoices-create.component';


@NgModule({
    imports: [RouterModule.forChild([
        {
                path: '',
                component: ListComponent,
        },
        {
                path: 'create',
                component: InvoicesCreateComponent,
            },

    ])],
    exports: [RouterModule]
})
export class InvoicesAppRoutingModule { }
