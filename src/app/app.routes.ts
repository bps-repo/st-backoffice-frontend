import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DashboardComponent } from './features/schoolar/features/dashboard/components/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';

export const AppRoutes: Routes = [

  // Rotas Públicas//
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
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

  // Rotas Protegidas //
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [], //Protege a rota AppLayoutComponent
    //canActivateChild: [AuthGuard], //Protege as rotas filhas
    //canLoad: [AuthGuard], //Protege o carregamento do módulo
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/features.module').then((m) => m.FeaturesModule),
      },
    ],
  },

  // Redirecionamento caso a rota não exista
  { path: '**', redirectTo: '/error404' },
];
