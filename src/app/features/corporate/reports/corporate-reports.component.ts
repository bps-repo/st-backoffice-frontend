import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewTabComponent} from "../../../shared/components/view-tab/view-tab.component";
import {CenterReports} from "./centers/center-reports.component";

@Component({
    selector: 'app-corporate-reports',
    standalone: true,
    imports: [CommonModule, ViewTabComponent],
    templateUrl: './corporate-reports.component.html',
})
export class CorporateReportsComponent {
    viewOptions = [
        {label: 'Geral', value: {key: 'general', component: null}},
        {label: 'Centro', value: {key: 'center', component: CenterReports}},
    ];
}
