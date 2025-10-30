import {Routes} from "@angular/router";
import {ManagementComponent} from "./features/management/management.component";
import {DetailComponent} from "./features/detail/detail.component";
import {RenewContractComponent} from "./features/renew/renew-contract.component";
import {CreateContractComponent} from "./features/create/create-contract.component";

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
        path: 'renew',
        component: RenewContractComponent
    },
    {
        path: 'details/:id',
        component: DetailComponent
    }
]
