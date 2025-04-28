import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateLessonDialogComponent} from './dialogs/create-lesson-dialog/create-lesson-dialog.component';
import {AttendenceDetailComponent} from './pages/detail/attendence-detail.component';
import {LessonComponent} from "./pages/list/lesson.component";

const routes: Routes = [
    {
        path: '',
        component: LessonComponent,
    },
    {
        path: 'create',
        component: CreateLessonDialogComponent,
    },
    {
        path: ':id',
        component: AttendenceDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LessonsRoutes {
}
