import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {DatePickerModule} from 'primeng/datepicker';
import {SelectButtonModule} from "primeng/selectbutton";
import {ViewTabComponent} from "../../../shared/components/view-tab/view-tab.component";

type ViewOption = { label: string; value: { key: string; component: any } };

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, DatePickerModule, SelectButtonModule, ViewTabComponent],
    template: `
        <app-view-tab [title]="'Dashboard'" [viewOptions]="viewOptions"/>`,
})
export class CorporateDashboard implements OnInit {

    viewOptions: ViewOption[] = [
        {label: 'Geral', value: {key: 'general', component: null}},
    ];

    ngOnInit() {
    }
}


