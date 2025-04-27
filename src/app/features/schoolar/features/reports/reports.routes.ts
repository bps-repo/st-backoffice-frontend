import {ListComponent} from "./pages/list/list.component";

export const reportsRoutes = [
    {
        path: '',
        component: ListComponent,
    },
    {
        path: ':id',
        component: ListComponent,
    }
];
