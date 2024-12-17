import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes), DashboardComponent],
    exports: [RouterModule],
})
export class FeaturesRoutingModule {}
