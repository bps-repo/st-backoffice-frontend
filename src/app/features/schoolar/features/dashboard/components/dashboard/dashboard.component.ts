import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {GeneralDashboardComponent} from "../general-dashboard/general-dashboard.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {StudentsDashboardComponent} from "../students-dashboard/student-dashboard.component";
import {MaterialsDashboardComponent} from "../../../materials/pages/materials-dashboard/materials-dashboard.component";
import {LessonsDashboardComponent} from "../lessons-dashboard/lessons-dashboard.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule, GeneralDashboardComponent, SelectButtonModule],
    templateUrl: './dashboard.component.html',
})
export class Dashboard implements OnInit {

    viewOptions: { label: string; value: { key: string; component: any } }[] = [
        {label: 'Geral', value: {key: 'general', component: GeneralDashboardComponent}},
        {label: 'Alunos', value: {key: 'students', component: StudentsDashboardComponent}},
        {label: 'Aulas', value: {key: 'lessons', component: LessonsDashboardComponent}},
        {label: 'Turmas', value: {key: 'classes', component: null}},
        {label: 'Materiais', value: {key: 'materials', component: MaterialsDashboardComponent}},
        {label: 'Calendário', value: {key: 'calendar', component: null}}
    ];

    selectedView!: { label: string; value: { key: string; component: any } };

    ngOnInit() {
        const savedViewKey = localStorage.getItem('selectedViewKey');
        this.selectedView = this.viewOptions.find(view => view.value.key === savedViewKey) || this.viewOptions[0];
    }

    changeView() {
        console.log('Selected view:', this.selectedView);
        localStorage.setItem('selectedViewKey', this.selectedView.value.key);
    }
}
