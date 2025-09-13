import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { MaterialsCreateComponent } from './pages/create/materials-create.component';
import { DetailComponent } from './pages/detail/detail.component';
import { MaterialsDashboardComponent } from './pages/materials-dashboard/materials-dashboard.component';
import { MaterialsLevelsComponent } from './pages/levels/materials-levels.component';
import { LevelMaterialsComponent } from './pages/level-materials/level-materials.component';
import { UnitsMaterialsComponent } from './pages/units-materials/units-materials.component';
import { TipsMaterialsComponent } from './pages/tips-materials/tips-materials.component';

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
            component: LevelMaterialsComponent,
        },
        {
            path: 'level/:levelId/units',
            component: UnitsMaterialsComponent,
        },
        {
            path: 'level/:levelId/tips',
            component: TipsMaterialsComponent,
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
