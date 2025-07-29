import {
    Component,
    InjectionToken,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {Tab} from '../../../@types/tab';
import {CommonModule} from '@angular/common';
import {Observable, of, Subscription} from 'rxjs';

@Component({
    selector: 'app-tab-view',
    imports: [TabMenuModule, TabViewModule, CommonModule],
    templateUrl: './tab-view.component.html',
    standalone: true,
    styleUrl: './tab-view.component.scss'
})
export class TabViewComponent implements OnInit, OnDestroy {
    @ViewChild('dynamicComponentContainer', {read: ViewContainerRef})
    container!: ViewContainerRef;

    @Input()
    tabs: Tab[] = [];

    @Input()
    data: any

    private subscription = new Subscription();

    constructor(private injector: Injector) {}

    ngOnInit(): void {
        // Subscribe to data changes and update tab data values
        if (this.data) {
            // Update each tab's data value
            this.tabs.forEach(tab => {
                tab.data.value = this.data;
            })
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getInjector<T>(token: InjectionToken<string>, data: T): Injector {
        return Injector.create({
            providers: [{provide: token, useValue: data}],
            parent: this.injector
        });
    }
}
