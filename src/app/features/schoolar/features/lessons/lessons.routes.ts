import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LessonDetailComponent} from './pages/detail/lesson-detail.component';
import {BookLessonComponent} from "./components/book-lesson/book-lesson.component";
import {LessonsListComponent} from "./components/list/lessons-list.component";
import {AddMaterialComponent} from "./components/add-material/add-material.component";
import {CreateLessonComponent} from "./components/create/create-lesson.component";

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
    {
        path: 'materials/add/:lessonId',
        component: AddMaterialComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LessonsRoutes {
}
