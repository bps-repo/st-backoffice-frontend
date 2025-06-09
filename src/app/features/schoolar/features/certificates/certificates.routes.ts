import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { CertificatesDashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
    {
        path: 'students-materials-dashboard',
        component: CertificatesDashboardComponent,
    },
    {
        path: ':id',
        component: DetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CertificatesRoutes {}
