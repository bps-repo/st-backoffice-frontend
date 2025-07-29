import {Component, InjectionToken, Injector, Input, ViewChild, ViewContainerRef} from '@angular/core';
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


    constructor(private injector: Injector) {
    }

    getInjector<T>(token: InjectionToken<T>, data: T): Injector {
        return Injector.create({
            providers: [{provide: token, useValue: data}],
            parent: this.injector
        });
    }
}
