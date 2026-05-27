import { Component } from '@angular/core';
import { ViewTabComponent } from '../../../../shared/components/view-tab/view-tab.component';
import { GeneralScholarSettingComponent } from './components/general/schoolar-settings.component';
import { LevelSettingComponent } from './components/level/level-setting.component';
import { AssessmentsSettingComponent } from './components/assessments/assessments-setting.component';

@Component({
    selector: 'scholar-settings',
    standalone: true,
    template: `
        <app-view-tab [title]="'Gestão Escolar'" [viewOptions]="viewOptions"/>
    `,
    imports: [ViewTabComponent],
})
export class ScholarSettings {
    viewOptions = [
        { label: 'Geral', value: { key: 'general', component: GeneralScholarSettingComponent } },
        { label: 'Níveis', value: { key: 'level', component: LevelSettingComponent } },
        { label: 'Avaliações', value: { key: 'assessments', component: AssessmentsSettingComponent } },
    ];
}
