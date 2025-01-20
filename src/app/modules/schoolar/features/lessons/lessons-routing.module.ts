import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonsComponent } from './components/classes/classes.component';
import { DetailsComponent } from './components/details/details.component';
import { CreateLessonComponent } from './components/create-lesson/create-lesson.component';

const routes: Routes = [
    {
        path: '',
        component: LessonsComponent,
    },
    {
        path: 'create',
        component: CreateLessonComponent,
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
export class LessonsRoutingModule {}
