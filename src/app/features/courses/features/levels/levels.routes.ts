import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './pages/detail/detail.component';
import { ListComponent } from './pages/list/list.component';
import { CreateLevelDialogComponent } from './dialogs/create-level-dialog/create-level-dialog.component';

export const LevelsRoutes: Routes = [
        {
            path: '',
            component: ListComponent,
        },
        {
            path: ':id',
            component: DetailComponent,
        },
        {
                path: 'create',
                component: CreateLevelDialogComponent,
            },
    ];


@NgModule({
    imports: [RouterModule.forChild(LevelsRoutes)],
    exports: [RouterModule],
})
export class LevelsRoutingModule {}

