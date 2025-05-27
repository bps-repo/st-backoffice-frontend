import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarAppComponent } from './components/calendar.app.component';
import { CalendarsDashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CalendarAppComponent },
        { path: 'dashboard', component: CalendarsDashboardComponent }
    ])],
    exports: [RouterModule]
})
export class CalendarRoutes { }
