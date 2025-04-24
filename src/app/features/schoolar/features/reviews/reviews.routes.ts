import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';


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

    ])],
    exports: [RouterModule]
})
export class ReviewsRoutes { }
