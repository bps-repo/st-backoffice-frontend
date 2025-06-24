import {Routes} from '@angular/router';
import {ListComponent} from "./features/list/list.component";
import {CreateComponent} from "./features/create/create.component";
import {DetailComponent} from "./features/detail/detail.component";


export const PaymentsRoutes: Routes = [
    {
        path: '',
        component: ListComponent
    },
    {
        path: 'create',
        component: CreateComponent
    },
    {
        path: 'details/:id',
        component: DetailComponent
    },
];
