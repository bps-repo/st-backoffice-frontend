import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { ReviewsCreateComponent } from './components/create/reviews-create.component';


@NgModule({
    imports: [RouterModule.forChild([
        {
                path: '',
                component: ListComponent,
        },
        {
                path: 'create',
                component: ReviewsCreateComponent,
            },

    ])],
    exports: [RouterModule]
})
export class ReviewsAppRoutingModule { }
