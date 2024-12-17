import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcommerceDashboardComponent } from 'src/app/demo/components/dashboards/ecommerce/ecommerce.dashboard.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./features/features.module').then((m) => m.FeaturesModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SchoolarRoutingModule {}
