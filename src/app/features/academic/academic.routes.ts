import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export  const AcademicRoutes: Routes = [
    {
        path: 'assessments',
        loadChildren: () =>
            import('./features/assessments/assessments.module').then((m) => m.AssessmentsModule),
    },
    {
        path: 'attendance',
        loadChildren: () =>
            import('./features/attendance/attendance.module').then((m) => m.AttendanceModule),
    },
    {
        path: 'classes',
        loadChildren: () =>
            import('./features/classes/classes.module').then((m) => m.ClassesModule),
    },
    {
        path: 'evaluations',
        loadChildren: () =>
            import('./features/evaluations/evaluations.module').then((m) => m.EvaluationsModule),
    },
    {
        path: 'lessons',
        loadChildren: () =>
            import('./features/lessons/lessons.module').then((m) => m.LessonsModule),
    },
];

