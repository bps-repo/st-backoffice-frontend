import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from 'src/app/shared/@types/tab';
import { TabViewComponent } from 'src/app/shared/components/tab-view/tab-view.component';
import { STUDENTS_TABS } from 'src/app/shared/constants/students';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [TabMenuModule, TabViewModule, CommonModule, TabViewComponent],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
    tabs!: Observable<Tab[]>;

    ngOnInit() {
        this.tabs = STUDENTS_TABS;
    }
}
