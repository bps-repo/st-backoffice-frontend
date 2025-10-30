import {Routes} from '@angular/router';
import {ScholarSettings} from "./features/settings/scholar-settings.component";
import {ScholarReports} from "./features/reports/scholar-reports.component";
import {SchoolarDashboard} from "./features/dashboard/dashboard.component";
import {PermissionGuard} from 'src/app/core/guards/permission.guard';
import {ListComponent as PaymentReportsListComponent} from '../finance/reports/payment/list.component';

export const ScholarRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'dashboards',
                pathMatch: 'full',
            },
            {
                path: 'dashboards',
                component: SchoolarDashboard,
            },
            {
                path: 'students',
                loadChildren: () =>
                    import('./features/students/students.routes').then((m) => m.StudentsRoutes),
                canActivate: [PermissionGuard],
                data: {permission: 'students.view'},
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
                canActivate: [PermissionGuard],
                data: {permission: 'lessons.view'},
            },
            {
                path: 'calendar',
                loadChildren: () =>
                    import('./features/calendars/calendar.routes').then((m) => m.CalendarRoutes),
                canActivate: [PermissionGuard],
                data: {permission: 'lessons.view'},
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
                path: 'certificates',
                loadChildren: () =>
                    import('./features/certificates/certificates.routes').then((m) => m.CertificatesRoutes),
            },
            {
                path: 'reports',
                component: ScholarReports
            },
            {
                path: 'payments',
                loadChildren: () => import('../finance/payments/payments.routes').then(m => m.PaymentsRoutes)
            },
            {
                path: 'payments/reports',
                component: PaymentReportsListComponent
            },
            {
                path: 'settings',
                component: ScholarSettings
            },
        ]
    }
];
