import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from '../../@types/tab';

@Component({
    selector: 'app-tab-view',
    standalone: true,
    imports: [TabMenuModule, TabViewModule],
    templateUrl: './tab-view.component.html',
    styleUrl: './tab-view.component.scss',
})
export class TabViewComponent {
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
    container!: ViewContainerRef;
    @Input() tabs: Tab[] = [];
}
