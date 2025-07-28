import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {SelectButtonModule} from "primeng/selectbutton";

type ViewOption = { label: string; value: { key: string; component: any }, icon?: string };

@Component({
    selector: 'app-view-tab',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule, SelectButtonModule],
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
