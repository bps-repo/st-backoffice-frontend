import {Routes} from '@angular/router';
import {DashboardComponent} from './features/dashboard/components/dashboard/dashboard.component';

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
                    import('./features/students/students.routes').then((m) => m.STUDENTS_ROUTES),
            },
            {
                path: 'entities',
                loadChildren: () =>
                    import('./features/entities/entities.routes').then((m) => m.EntitiesRoutes),
            },
            {
                path: 'lessons',
                loadChildren: () =>
                    import('./features/lessons/lessons.routes').then((m) => m.LessonsRoutes),
            },
            {
                path: 'calendar',
                loadChildren: () =>
                    import('./features/calendars/calendar.routes').then((m) => m.CalendarRoutes),
            },
            {
                path: 'reviews',
                loadChildren: () =>
                    import('./features/reviews/reviews.routes').then((m) => m.ReviewsRoutes),
            },
            {
                path: 'materials',
                loadChildren: () =>
                    import('./features/materials/materials.routes').then((m) => m.MaterialsRoutes)
            },
            {
                path: 'reports',
                loadChildren: () =>
                    import('./features/reports/reports.routes').then((m) => m.reportsRoutes),
            },
            {
                path: 'certificates',
                loadChildren: () =>
                    import('./features/certificates/certificates.routes').then((m) => m.CertificatesRoutes),
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('../schoolar/features/settings/settings.routes').then((m) => m.SettingsRoutes),
            },
        ]
    }
];
