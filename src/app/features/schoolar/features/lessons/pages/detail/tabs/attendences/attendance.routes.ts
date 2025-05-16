import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AttendenceCreateComponent} from "./create/attendence-create.component";
import {EditAttendenceComponent} from "./edit/edit-attendence.component";
import {AttendenceDetailComponent} from "../../attendence-detail.component";

const routes: Routes = [
    {
        path: 'create',
        component: AttendenceCreateComponent,
    },
    {
        path: 'edit/:id',
        component: EditAttendenceComponent,
    },
    {
        path: ':id',
        component: AttendenceDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AttendanceRoutes {}
