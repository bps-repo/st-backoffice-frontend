import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from '../../@types/tab';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-tab-view',
    standalone: true,
    imports: [TabMenuModule, TabViewModule, CommonModule],
    templateUrl: './tab-view.component.html',
    styleUrl: './tab-view.component.scss',
})
export class TabViewComponent {
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
    container!: ViewContainerRef;
    @Input() tabs: Observable<Tab[]> = of([]);
}
