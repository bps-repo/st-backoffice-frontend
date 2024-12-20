import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { GeneralComponent } from '../tabs/general/general.component';
import { ClassesComponent } from '../tabs/classes/classes.component';
import { Tab } from 'src/app/shared/@types/tab';
import { TabViewComponent } from 'src/app/shared/components/tab-view/tab-view.component';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [TabMenuModule, TabViewModule, CommonModule, TabViewComponent],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
    tabs: Tab[] = [];

    ngOnInit() {
        this.tabs = [
            {
                header: 'Geral',
                icon: 'pi pi-th-large',
                title: 'Overview ',
                description:
                    'Volutpat maecenas volutpat blandit aliquam etiam erat',
                template: GeneralComponent,
            },
            {
                header: 'Aulas',
                icon: 'pi pi-th-large',
                title: 'Suas Aulas',
                description:
                    'Volutpat maecenas volutpat blandit aliquam etiam erat',
                template: ClassesComponent,
            },
        ];
    }
}
