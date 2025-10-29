import { Routes } from "@angular/router";
import { ManagementComponent } from "./features/management/management.component";
import { DetailComponent } from "./features/detail/detail.component";
import { RenewContractComponent } from "./features/renew/renew-contract.component";
import { CreateContractComponent } from "./features/create/create-contract.component";
import { pendingChangesGuard } from "../../../core/guards/pending-changes.guard";

export const ContractsRoutes: Routes = [
    {
        path: '',
        component: ManagementComponent
    },
    {
        path: 'create',
        component: CreateContractComponent,
        canDeactivate: [pendingChangesGuard]
    },
    {
        path: 'renew',
        component: RenewContractComponent,
        canDeactivate: [pendingChangesGuard]
    },
    {
        path: 'details/:id',
        component: DetailComponent
    }
]
