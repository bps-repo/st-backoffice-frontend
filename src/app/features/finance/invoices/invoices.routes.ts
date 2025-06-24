import {Routes} from '@angular/router';
import {CreateComponent} from "./features/create/create.component";
import {ListComponent} from "./features/list/list.component";
import {DetailComponent} from "./features/detail/detail.component";
import {EditComponent} from "./features/edit/edit.component";

export const InvoicesRoutes: Routes = [
    {
        path: '',
        component: ListComponent
    },
    {
        path: 'create',
        component: CreateComponent
    },
    {
        path: 'edit/:id',
        component: EditComponent
    },
    {
        path: 'details/:id',
        component: DetailComponent
    },
];
