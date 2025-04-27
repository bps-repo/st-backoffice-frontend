import {ListComponent} from "./pages/list/list.component";
import {DetailComponent} from "./pages/detail/detail.component";

export const reportsRoutes = [
    {
        path: '',
        component: ListComponent,
    },
    {
        path: ':id',
        component: DetailComponent,
    }
];
