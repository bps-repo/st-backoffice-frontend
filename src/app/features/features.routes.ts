import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'schoolar',
        loadChildren: () =>
            import('./schoolar/schoolar.module').then((m) => m.SchoolarModule),
    },
    {
        path: 'academic',
        loadChildren: () =>
            import('./academic/academic.module').then((m) => m.AcademicModule),
    },
    {
        path: 'courses',
        loadChildren: () =>
            import('./courses/courses.module').then((m) => m.CoursesModule),
    },
    {
        path: 'comunication',
        loadChildren: () =>
            import('./comunication/comunication.module').then(
                (m) => m.ComunicationModule
            ),
    },
    {
        path: 'settings',
        loadChildren: () =>
            import('./settings/settings.module').then((m) => m.SettingsModule),
    },
    {
        path: 'human-resources',
        loadChildren: () =>
            import('./human-resources/human-resources.module').then(
                (m) => m.HumanResourcesModule
            ),
    },
    {
        path: 'invoices',
        loadChildren: () =>
            import('./invoices/invoices.module').then((m) => m.InvoicesModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FeaturesRoutes {}
