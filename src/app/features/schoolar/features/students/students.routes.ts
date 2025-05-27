import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list/list.component').then(c => c.ListComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(c => c.StudentsDashboardComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/create/create.component').then(c => c.CreateComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/detail/detail.component').then(c => c.DetailComponent),
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./pages/detail/tabs/courses/courses.component').then(c => c.CoursesComponent)
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('./pages/detail/tabs/invoices/invoices.component').then(c => c.InvoicesComponent)
      }
    ]
  }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudentsRoutes{
}
