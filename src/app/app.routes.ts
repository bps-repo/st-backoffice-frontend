import {Routes} from '@angular/router';
import {AppLayoutComponent} from './layout/app.layout.component';
import {DashboardComponent} from './features/schoolar/features/dashboard/components/dashboard/dashboard.component';

export const AppRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((m) => m.AuthRoutes),
    },
    {
        path: 'landing',
        loadChildren: () =>
            import('./shared/components/landing/landing.module').then((m) => m.LandingModule),
    },
    {
        path: 'error404',
        loadChildren: () =>
            import('./shared/components/notfound/notfound.module').then((m) => m.NotfoundModule),
    },

    // protected routes
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [],
        //canActivateChild: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: '',
                loadChildren: () =>
                    import('./features/features.routes').then((m) => m.FeaturesRoutes),
            },
        ],
    },

    // Redirecting to routes not found
    {path: '**', redirectTo: '/error404'},
];
