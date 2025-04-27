import { Routes } from '@angular/router';

/**
 * Routes for the students feature
 * Using standalone components approach
 */
export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list/list.component').then(c => c.ListComponent)
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
      // {
      //   path: 'info',
      //   loadComponent: () =>
      //     import('./pages/detail/tabs/info/info.component').then(c => c.InfoComponent)
      // },
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
