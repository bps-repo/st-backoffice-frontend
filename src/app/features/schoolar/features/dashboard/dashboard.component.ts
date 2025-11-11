import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from "primeng/selectbutton";
import { ViewTabComponent } from "../../../../shared/components/view-tab/view-tab.component";
import { GeneralScholarDashboardComponent } from "./components/general/general-scholar-dashboard.component";
import { StudentsDashboardComponent } from "./components/students/student-dashboard.component";
import { LessonsDashboardComponent } from "./components/lessons/lessons-dashboard.component";
import { MaterialsDashboardComponent } from "../materials/pages/materials-dashboard/materials-dashboard.component";
import { AssessmentsDashboardComponent } from "./components/assessments/assessment-dashboard.component";
import { LevelDashboardComponent } from "./components/level/level-dashboard.component";


type ViewOption = { label: string; value: { key: string; component: any }, icon?: string };

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule, SelectButtonModule, ViewTabComponent],
    template: `
        <app-view-tab [title]="'Dashboard'" [viewOptions]="viewOptions"/>
    `,
})
export class SchoolarDashboard {
    viewOptions: ViewOption[] = [
        { label: 'Alunos', value: { key: 'students', component: StudentsDashboardComponent } },
        { label: 'Aulas', value: { key: 'lessons', component: LessonsDashboardComponent } },
        { label: 'Materiais', value: { key: 'materials', component: MaterialsDashboardComponent } },
        { label: 'Avaliações', value: { key: 'assessments', component: AssessmentsDashboardComponent } },
        { label: 'Níveis', value: { key: 'levels', component: LevelDashboardComponent } },
    ];
}
