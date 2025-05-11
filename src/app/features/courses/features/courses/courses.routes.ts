import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './pages/detail/detail.component';
import { ListComponent } from './pages/list/list.component';

export const CourseRoutes: Routes = [
        {
            path: '',
            component: ListComponent,
        },
        {
            path: ':id',
            component: DetailComponent,
        },
    ];


@NgModule({
    imports: [RouterModule.forChild(CourseRoutes)],
    exports: [RouterModule],
})
export class CoursesRoutingModule {}


