import {Component} from "@angular/core";
import {ViewTabComponent} from "../../../../shared/components/view-tab/view-tab.component";
import {GeneralScholarReport} from "./components/general/general-scholar-report.component";
import {StudentReports} from "./components/student/student-reports.component";
import {LevelReports} from "./components/level/level-reports.component";

@Component({
    selector: 'app-finance-settings',
    standalone: true,
    template: `
        <app-view-tab [title]="'Relatórios'" [viewOptions]="viewOptions"/>
    `,
    imports: [
        ViewTabComponent
    ]
})
export class ScholarReports {
    viewOptions = [
        {label: 'Geral', value: {key: 'general', component: GeneralScholarReport}},
        {label: 'Estudantes', value: {key: 'students', component: StudentReports}},
        {label: 'Níveis', value: {key: 'levels', component: LevelReports}},
    ];
}
