import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateLessonComponent} from './dialogs/create-lesson-dialog/create-lesson.component';
import {LessonDetailComponent} from './pages/detail/lesson-detail.component';
import {BookLessonComponent} from "./components/book-lesson/book-lesson.component";
import {LessonsListComponent} from "./components/list/lessons-list.component";

const routes: Routes = [
    {
        path: '',
        component: LessonsListComponent,
    },
    {
        path: 'create',
        component: CreateLessonComponent,
    },
    {
        path: ':id',
        component: LessonDetailComponent,
    },
    {
        path: 'books/:lessonId/:studentId',
        component: BookLessonComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LessonsRoutes {
}
