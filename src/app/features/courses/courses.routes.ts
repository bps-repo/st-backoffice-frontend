import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';

export const CoursesRoutes: Routes = [
    {
            path: '',
                    children: [
                        {
                            path: '',
                            redirectTo: 'students-materials-dashboard',
                            pathMatch: 'full',
                        },
                        {
                            path: 'students-materials-dashboard',
                            component: DashboardComponent,
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
                                import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
                        },
                        {
                            path: 'settings',
                            loadChildren: () =>
                                import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
                        },

                    ]
        }
];
