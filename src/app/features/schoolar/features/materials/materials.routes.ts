import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { MaterialsCreateComponent } from './pages/create/materials-create.component';
import { DetailComponent } from './pages/detail/detail.component';
import { MaterialsDashboardComponent } from './pages/materials-dashboard/materials-dashboard.component';
import { MaterialsLevelsComponent } from './pages/levels/materials-levels.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: MaterialsLevelsComponent,
        },
        {
            path: 'students-materials-dashboard',
            component: MaterialsDashboardComponent,
        },
        {
            path: 'level/:levelId',
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
