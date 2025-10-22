import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateLessonComponent} from './components/create/create-lesson.component';
import {LessonDetailComponent} from './pages/detail/lesson-detail.component';
import {BookLessonComponent} from "./components/book-lesson/book-lesson.component";
import {LessonsListComponent} from "./components/list/lessons-list.component";
import {ScheduleLessonsComponent} from "./components/schedule-lessons/schedule-lessons.component";
import {BulkBookingComponent} from "./components/bulk-booking/bulk-booking.component";

const routes: Routes = [
    {
        path: '',
        component: LessonsListComponent,
    },
    {
        path: 'schedule',
        component: ScheduleLessonsComponent,
    },
    {
        path: 'bulk-booking',
        component: BulkBookingComponent,
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
