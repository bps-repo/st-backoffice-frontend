import { Routes } from '@angular/router';
import { DashboardComponent } from '../schoolar/features/dashboard/components/dashboard/dashboard.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { classesFeature, scholarEffects, studentsFeature } from '../../core/store/schoolar';

/**
 * Routes for the schoolar feature
 * Using functional approach for lazy loading and providing store features
 */
export const SCHOOLAR_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'students',
                loadChildren: () =>
                    import('../schoolar/features/students/students.routes').then((m) => m.STUDENTS_ROUTES),
            },
            {
                path: 'entities',
                loadChildren: () =>
                    import('../schoolar/features/entities/entities.routes').then((m) => m.EntitiesRoutes),
            },
            {
                path: 'classes',
                loadChildren: () =>
                    import('../schoolar/features/classes/classes.routes').then((m) => m.ClassesRoutes),
            },
            {
                path: 'calendar',
                loadChildren: () =>
                    import('../schoolar/features/calendars/calendar.routes').then((m) => m.CalendarRoutes),
            },
            {
                path: 'reviews',
                loadChildren: () =>
                    import('../schoolar/features/reviews/reviews.routes').then((m) => m.ReviewsRoutes),
            },
            {
                path: 'materials',
                loadChildren: () =>
                    import('../schoolar/features/materials/materials.routes').then((m) => m.MaterialsRoutes),
            },
        ]
    }
];
