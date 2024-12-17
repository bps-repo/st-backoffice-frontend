import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarAppComponent } from './components/calendar.app.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CalendarAppComponent }
    ])],
    exports: [RouterModule]
})
export class CalendarAppRoutingModule { }
