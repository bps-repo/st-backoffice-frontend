import {Routes} from "@angular/router";
import {ManagementComponent} from "./features/management/management.component";
import {DetailComponent} from "./features/detail/detail.component";
import {CreateContractComponent} from "./features/create-contract/create-contract.component";

export const ContractsRoutes: Routes = [
    {
        path: '',
        component: ManagementComponent
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
