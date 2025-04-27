import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { MaterialsCreateComponent } from './pages/create/materials-create.component';
import { DetailComponent } from './pages/detail/detail.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
             component: ListComponent,
        },
        {
            path: 'create',
            component: MaterialsCreateComponent,
        },
        {
            path: ':id',
            component: DetailComponent,
        },
    ])],
    exports: [RouterModule]
})
export class MaterialsRoutes { }
