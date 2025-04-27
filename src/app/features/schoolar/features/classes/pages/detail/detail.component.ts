import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from 'src/app/shared/@types/tab';
import { TabViewComponent } from 'src/app/shared/components/tables/tab-view/tab-view.component';
import { CLASSES_TABS } from 'src/app/shared/constants/classes';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { classesActions } from 'src/app/core/store/schoolar';
import { selectSelectedClass } from 'src/app/core/store/schoolar/selectors/classes.selectors';
import { Class } from 'src/app/core/models/academic/class';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [
        TabMenuModule,
        TabViewModule,
        CommonModule,
        TabViewComponent,
        SplitButtonModule,
    ],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit, OnDestroy {
    tabs!: Observable<Tab[]>;
    items!: MenuItem[];
    classItem: Class | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit() {
        this.tabs = CLASSES_TABS;

        // Get the class ID from the route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    // Dispatch action to load the class
                    this.store.dispatch(classesActions.loadClass({ id }));
                }
            });

        // Subscribe to the selected class
        this.store.select(selectSelectedClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classItem => {
                this.classItem = classItem!;
            });

        this.items = [
            { label: 'Edit Class', icon: 'pi pi-pencil' },
            { label: 'Add Student', icon: 'pi pi-user-plus' },
            { label: 'Schedule Lesson', icon: 'pi pi-calendar-plus' },
            { separator: true },
            { label: 'Print Class Report', icon: 'pi pi-file-pdf' },
            { label: 'Export Student List', icon: 'pi pi-file-excel' },
            { separator: true },
            {
                label: 'Deactivate Class',
                icon: 'pi pi-times',
                styleClass: 'text-red-500',
                tooltip: 'Deactivate this class',
            },
        ];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
