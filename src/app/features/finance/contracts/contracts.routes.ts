import {Routes} from "@angular/router";
import {ListComponent} from "./features/list/list.component";
import {ManagementComponent} from "./features/management/management.component";
import {CreateComponent} from "./features/create/create.component";
import {DetailComponent} from "./features/detail/detail.component";

export const ContractsRoutes: Routes = [
    {
        path: '',
        component: ManagementComponent
    },
    {
        path: 'list',
        component: ListComponent
    },
    {
        path: 'create',
        component: CreateComponent
    },
    {
        path: 'details/:id',
        component: DetailComponent
    }
]
