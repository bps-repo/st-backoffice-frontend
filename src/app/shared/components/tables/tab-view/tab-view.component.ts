import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {Tab} from '../../../@types/tab';
import {CommonModule} from '@angular/common';
import {Observable, of} from 'rxjs';

@Component({
    selector: 'app-tab-view',
    imports: [TabMenuModule, TabViewModule, CommonModule],
    templateUrl: './tab-view.component.html',
    standalone: true,
    styleUrl: './tab-view.component.scss'
})
export class TabViewComponent {
    @ViewChild('dynamicComponentContainer', {read: ViewContainerRef})
    container!: ViewContainerRef;

    @Input()
    tabs: Tab[] = [];

    @Input()
    data: Observable<any> = of()


    constructor() {
        this.data.subscribe(data => {
            console.log(data)
        })
    }
}
