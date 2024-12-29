import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'students',
        loadChildren: () =>
            import('./students/students.module').then((m) => m.StudentsModule),
    },
    {
        path: 'entities',
        loadChildren: () =>
            import('./entities/entities.module').then((m) => m.EntitiesModule),
    },
    {
        path: 'students',
        loadChildren: () =>
            import('./students/students.module').then((m) => m.StudentsModule),
    },

    {
        path: 'classes',
        loadChildren: () =>
            import('./classes/classes.module').then((m) => m.ClassesModule),
    },
    {
        path: 'calendar',
        loadChildren: () =>
            import('./calendar/calendar.app.module').then(
                (m) => m.CalendarAppModule
            ),
    },
    {
        path: 'reviews',
        loadChildren: () =>
            import('./reviews/reviews.app.module').then((m) => m.ReviewsAppModule),
    },
    {
        path: 'materials',
        loadChildren: () =>
            import('./materials/materials.app.module').then((m) => m.MaterialsAppModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FeaturesRoutingModule {}
