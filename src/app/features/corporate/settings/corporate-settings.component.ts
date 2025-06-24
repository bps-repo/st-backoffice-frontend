import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewTabComponent} from "../../../shared/components/view-tab/view-tab.component";
import {PaymentComponent} from "../../../shared/components/uikit/menus/payment.component";
import {CenterSettingsComponent} from "./centers/center-settings.component";

@Component({
    selector: 'app-reports-dashboard',
    standalone: true,
    imports: [CommonModule, ViewTabComponent],
    template: `
        <app-view-tab [title]="'Definições'" [viewOptions]="viewOptions"/>`,
})
export class CorporateSettingsComponent {
    viewOptions = [
        {label: 'Geral', value: {key: 'general', component: null}},
        {label: 'Centros', value: {key: 'centers', component: CenterSettingsComponent}},
    ];
}
