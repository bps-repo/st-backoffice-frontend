import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewTabComponent} from "../../../shared/components/view-tab/view-tab.component";
import {CenterSettingsComponent} from "./centers/center-settings.component";
import {GeneralSettingsComponent} from "./general/general-settings.component";
import {EmployeeSettingsComponent} from "./employees/employee-settings.component";

@Component({
    selector: 'app-corporate-settings',
    standalone: true,
    imports: [CommonModule, ViewTabComponent],
    template: `
        <app-view-tab [title]="'Definições'" [viewOptions]="viewOptions"/>`,
})
export class CorporateSettingsComponent {
    viewOptions = [
        {label: 'Geral', value: {key: 'general', component: GeneralSettingsComponent}},
        {label: 'Centros', value: {key: 'centers', component: CenterSettingsComponent}},
        {label: 'Trabalhadores', value: {key: 'employees', component: EmployeeSettingsComponent}},
    ];
}
