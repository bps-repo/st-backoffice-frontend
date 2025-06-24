import {Routes} from '@angular/router';
import {Dashboard} from './features/dashboard/components/dashboard/dashboard.component';

export const SCHOOLAR_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: 'students-materials-dashboard',
                redirectTo: 'dashboards',
                pathMatch: 'full',
            },
            {
                path: 'dashboards',
                component: Dashboard,
            },
            {
                path: 'students',
                loadChildren: () =>
                    import('./features/students/students.routes').then((m) => m.StudentsRoutes),
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
                path: 'classes',
                loadChildren: () =>
                    import('./features/classes/classes.routes').then((m) => m.ClassesRoutes),
            },
            {
                path: 'calendar',
                loadChildren: () =>
                    import('./features/calendars/calendar.routes').then((m) => m.CalendarRoutes),
            },
            {
                path: 'assessments',
                loadChildren: () =>
                    import('./features/assessments/assessments.routes').then((m) => m.AssessmentsRoutes),
            },
            {
                path: 'materials',
                loadChildren: () =>
                    import('./features/materials/materials.routes').then((m) => m.MaterialsRoutes)
            }, {
                path: '',
                redirectTo: 'students-materials-dashboard',
                pathMatch: 'full',
            },
            {
                path: 'courses',
                loadChildren: () =>
                    import('./features/courses/courses.routes').then((m) => m.CourseRoutes),
            },
            {
                path: 'levels',
                loadChildren: () =>
                    import('./features/levels/levels.routes').then((m) => m.LevelsRoutes),
            },
            {
                path: 'units',
                loadChildren: () =>
                    import('./features/units/units.routes').then((m) => m.UnitsRoutes),
            },
            {
                path: 'reports',
                loadChildren: () =>
                    import('./features/level-reports/reports.routes').then((m) => m.REPORTS_ROUTES),
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./features/level-settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
            },
            {
                path: 'reports',
                loadChildren: () =>
                    import('./features/reports/reports.routes').then((m) => m.ReportsRoutes),
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
