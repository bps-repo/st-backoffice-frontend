import { Routes } from '@angular/router';
import { CalendarAppComponent } from './components/calendar.app.component';
import { CalendarsDashboardComponent } from './components/dashboard/dashboard.component';

export const CalendarRoutes: Routes = [
    {
        path: '',
        component: CalendarAppComponent,
    },
    {
        path: 'students-materials-dashboard',
        component: CalendarsDashboardComponent,
    }
];