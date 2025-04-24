import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../schoolar/features/dashboard/components/dashboard/dashboard.component';

const routes: Routes = [

        {
        path: '',
        redirectTo: 'dashboard', // Optional: Redirect to default child path
        pathMatch: 'full',
        },
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
        {
            path: 'students',
            loadChildren: () =>
                import('../schoolar/features/students/students.module').then((m) => m.StudentsModule),
        },
        {
            path: 'entities',
            loadChildren: () =>
                import('../schoolar/features/entities/entities.module').then((m) => m.EntitiesModule),
        },
        {
            path: 'students',
            loadChildren: () =>
                import('../schoolar/features/students/students.module').then((m) => m.StudentsModule),
        },

        {
            path: 'classes',
            loadChildren: () =>
                import('../schoolar/features/classes/classes.module').then((m) => m.ClassesModule),
        },
        {
            path: 'calendar',
            loadChildren: () =>
                import('../schoolar/features/calendars/calendar.module').then(
                    (m) => m.CalendarsModule
                ),
        },
        {
            path: 'reviews',
            loadChildren: () =>
                import('../schoolar/features/reviews/reviews.module').then((m) => m.ReviewsModule),
        },
        {
            path: 'materials',
            loadChildren: () =>
                import('../schoolar/features/materials/materials.module').then((m) => m.MaterialsModule),
        },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SchoolarRoutes {}
