import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-management',
    pathMatch: 'full'
  },
  {
    path: 'user-management',
    loadComponent: () =>
      import('./user-management/user-management.component').then(c => c.UserManagementComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutes {}
