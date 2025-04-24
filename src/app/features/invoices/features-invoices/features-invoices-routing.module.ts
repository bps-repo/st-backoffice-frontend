import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

    {
        path: 'invoices',
        loadChildren: () =>
            import('./form-invoices/form-invoices.module').then((m) => m.FormInvoicesModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FeaturesInvoicesRoutingModule {}
