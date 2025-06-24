import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {GeneralDashboardComponent} from "../general/general-dashboard.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {StudentsDashboardComponent} from "../students/student-dashboard.component";
import {LessonsDashboardComponent} from "../lessons/lessons-dashboard.component";
import {ClassesDashboardComponent} from "../classes/classes-dashboard.component";
import {AssessmentsDashboardComponent} from "../assessments/assessment-dashboard.component";
import {MaterialsDashboardComponent} from "../../materials/pages/materials-dashboard/materials-dashboard.component";
import {LevelDashboardComponent} from "../../level-dashboard/components/dashboard/level-dashboard.component";

type ViewOption = { label: string; value: { key: string; component: any } };

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule, SelectButtonModule],
    templateUrl: './dashboard.component.html',
})
export class Dashboard implements OnInit {

    viewOptions: ViewOption[] = [
        {label: 'Geral', value: {key: 'general', component: GeneralDashboardComponent}},
        {label: 'Alunos', value: {key: 'students', component: StudentsDashboardComponent}},
        {label: 'Aulas', value: {key: 'lessons', component: LessonsDashboardComponent}},
        {label: 'Turmas', value: {key: 'classes', component: ClassesDashboardComponent}},
        {label: 'Materiais', value: {key: 'materials', component: MaterialsDashboardComponent}},
        {
            label: 'Avaliações',
            value: {key: 'assessments', component: AssessmentsDashboardComponent}
        },
        {label: 'Níveis', value: {key: 'levels', component: LevelDashboardComponent}},
    ];

    selectedView!: ViewOption;

    ngOnInit() {
        const savedViewKey = localStorage.getItem('selectedViewKey');
        this.selectedView = this.viewOptions.find(view => view.value.key === savedViewKey) || this.viewOptions[0];
    }

    changeView() {
        localStorage.setItem('selectedViewKey', this.selectedView.value.key);
    }

    get getSelectedComponent() {
        return this.selectedView.value.component;
    }
}
