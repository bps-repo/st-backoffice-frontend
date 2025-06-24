import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClassComponent} from './pages/list/class.component';
import {ClassCreateComponent} from './pages/create/class-create.component';
import {ClassEditComponent} from './pages/edit/class-edit.component';
import {ClassDetailComponent} from './pages/detail/class-detail.component';

export const ClassesRoutes: Routes = [
    {
        path: '',
        component: ClassComponent,
    },
    {
        path: 'create',
        component: ClassCreateComponent,
    },
    {
        path: 'edit/:id',
        component: ClassEditComponent,
    },
    {
        path: ':id',
        component: ClassDetailComponent,
    },
];

