import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './pages/detail/detail.component';
import { ListComponent } from './pages/list/list.component';

export const UnitsRoutes: Routes = [
        {
            path: '',
            component: ListComponent,
        },
        {
            path: ':id',
            component: DetailComponent,
        }
    ];


@NgModule({
    imports: [RouterModule.forChild(UnitsRoutes)],
    exports: [RouterModule],
})
export class UnitsRoutingModule {}

