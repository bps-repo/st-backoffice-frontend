import {Routes} from '@angular/router';
import {AppLayoutComponent} from './layout/app.layout.component';
import {AuthGuard} from "./core/guards/auth.guard";

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: '/schoolar/dashboards',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((m) => m.AuthRoutes),
    },
    {
        path: 'landing',
        loadChildren: () =>
            import('./shared/components/landing/landing-routing.module').then((m) => m.LandingRoutingModule),
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
        canActivate: [AuthGuard],
        children: [
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
