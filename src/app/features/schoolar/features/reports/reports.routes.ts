import {ListComponent} from "./pages/list/list.component";
import {DetailComponent} from "./pages/detail/detail.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [

    {
        path: '',
        component: ListComponent,
    },
    {
        path: ':id',
        component: DetailComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsRoutes{
}
