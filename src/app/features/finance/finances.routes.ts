import {Routes} from "@angular/router";
import {InvoicesComponent} from "../schoolar/features/students/pages/detail/tabs/invoices/invoices.component";
import {PaymentComponent} from "../../shared/components/uikit/menus/payment.component";

export const FINANCES_ROUTES: Routes = [
    {
        path: 'invoices',
        component: InvoicesComponent
    },
    {
        path: 'payments',
        component: PaymentComponent
    }
]
