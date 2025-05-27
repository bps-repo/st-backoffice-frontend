import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateLessonComponent} from './dialogs/create-lesson-dialog/create-lesson.component';
import {LessonDetailComponent} from './pages/detail/lesson-detail.component';
import {LessonsListComponent} from "./pages/list/lessons-list.component";
import {LessonsDashboardComponent} from "./pages/dashboard/dashboard.component";

const routes: Routes = [
    {
        path: '',
        component: LessonsListComponent,
    },
    {
        path: 'dashboard',
        component: LessonsDashboardComponent,
    },
    {
        path: 'create',
        component: CreateLessonComponent,
    },
    {
        path: ':id',
        component: LessonDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LessonsRoutes {
}
