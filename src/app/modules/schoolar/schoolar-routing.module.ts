import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcommerceDashboardComponent } from 'src/app/demo/components/dashboards/ecommerce/ecommerce.dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: EcommerceDashboardComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SchoolarRoutingModule {}
