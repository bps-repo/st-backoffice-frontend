import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';


@NgModule({
    imports: [RouterModule.forChild([
        {
                path: '',
                component: ListComponent,
        },
        {
                path: 'create',
                component: CreateComponent,
        },
        {
                path: ':id',
                component: DetailComponent,
        },
    ])],
    exports: [RouterModule]
})
export class ReviewsRoutes { }
