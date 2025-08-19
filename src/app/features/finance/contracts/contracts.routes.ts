import {Routes} from "@angular/router";
import {ListComponent} from "./features/list/list.component";
import {ManagementComponent} from "./features/management/management.component";
import {CreateComponent} from "./features/create/create.component";
import {DetailComponent} from "./features/detail/detail.component";
import {CreateContractComponent} from "./features/create-contract/create-contract.component";

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
        component: CreateContractComponent
    },
    {
        path: 'details/:id',
        component: DetailComponent
    }
]
