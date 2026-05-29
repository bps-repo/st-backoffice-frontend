import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {DatePickerModule} from 'primeng/datepicker';
import {Select} from "primeng/select";
import {Button} from "primeng/button";

type ViewOption = { label: string; value: { key: string; component: any }, icon?: string };

@Component({
    selector: 'app-view-tab',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, DatePickerModule, Select, Button],
    templateUrl: './view-tab.component.html',
})
export class ViewTabComponent implements OnInit {

    @Input()
    title: string = '';

    @Input()
    viewOptions: ViewOption[] = [];

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
