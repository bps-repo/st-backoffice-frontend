import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DashboardComponent } from './features/schoolar/features/dashboard/components/dashboard/dashboard.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
};

export const AppRoutes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
            },
            {
                path: 'modules',
                loadChildren: () =>
                    import('./features/features.module').then(
                        (m) => m.FeaturesModule
                    ),
            },
        ],
    },
    {
        path: 'auth',
        data: { breadcrumb: 'Auth' },
        loadChildren: () =>
            import('./features/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'landing',
        loadChildren: () =>
            import('./shared/components/landing/landing.module').then(
                (m) => m.LandingModule
            ),
    },
    {
        path: 'error404',
        loadChildren: () =>
            import('./shared/components/notfound/notfound.module').then(
                (m) => m.NotfoundModule
            ),
    },
    { path: '**', redirectTo: '/error404' },
];

@NgModule({
    imports: [RouterModule.forRoot(AppRoutes, routerOptions)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
