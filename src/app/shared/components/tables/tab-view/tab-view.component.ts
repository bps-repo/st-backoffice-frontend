import {
    Component,
    inject,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from '../../../@types/tab';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tab-view',
    imports: [TabMenuModule, TabViewModule, CommonModule],
    templateUrl: './tab-view.component.html',
    standalone: true,
    styleUrl: './tab-view.component.scss'
})
export class TabViewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() tabs: Tab[] = [];
    @Input() data: any;

    tabInjectors: Injector[] = [];

    private parentInjector = inject(Injector);
    private subscription = new Subscription();

    ngOnInit(): void {
        this.buildInjectors();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && !changes['data'].firstChange) {
            this.buildInjectors();
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private buildInjectors(): void {
        this.tabInjectors = this.tabs.map(tab =>
            Injector.create({
                providers: [{ provide: tab.data.token, useValue: this.data }],
                parent: this.parentInjector
            })
        );
    }
}
