import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateClassesDialogComponent } from './dialogs/create-classes-dialog/create-classes-dialog.component';
import { DetailsComponent } from './components/details/details.component';

const routes: Routes = [
    {
        path: '',
        component: CreateClassesDialogComponent,
    },
    {
        path: ':id',
        component: DetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassesRoutes {}
