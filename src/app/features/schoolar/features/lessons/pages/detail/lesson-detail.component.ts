import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {Tab} from 'src/app/shared/@types/tab';
import {TabViewComponent} from 'src/app/shared/components/tables/tab-view/tab-view.component';
import {LESSONS_TABS} from 'src/app/shared/constants/classes';
import {Observable, Subject, takeUntil} from 'rxjs';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {selectSelectedClass} from 'src/app/core/store/schoolar/selectors/classes.selectors';
import {Lesson} from "../../../../../../core/models/academic/lesson";
import {LessonStatus} from "../../../../../../core/enums/lesson-status";
import {lessonsActions} from "../../../../../../core/store/schoolar/actions/lessons.actions";

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
    templateUrl: './lesson-detail.component.html'
})
export class LessonDetailComponent implements OnInit, OnDestroy {
    tabs!: Observable<Tab[]>;
    items!: MenuItem[];
    classItem: Lesson | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {
    }

    ngOnInit() {
        this.tabs = LESSONS_TABS;

        // Get the class ID from the route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    // Dispatch action to load the class
                    this.store.dispatch(lessonsActions.loadLesson({id}));
                }
            });

        // Subscribe to the selected class
        this.store.select(selectSelectedClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classItem => {
                this.classItem = classItem!;
            });

        this.items = [
            {label: 'Edit Lesson', icon: 'pi pi-pencil'},
            {label: 'Mark Attendance', icon: 'pi pi-check-square'},
            {separator: true},
            {label: 'Add Material', icon: 'pi pi-plus-circle'},
            {label: 'Upload Materials', icon: 'pi pi-upload'},
            {label: 'Manage Materials', icon: 'pi pi-book'},
            {separator: true},
            {label: 'Print Lesson Report', icon: 'pi pi-file-pdf'},
            {label: 'Export Attendance', icon: 'pi pi-file-excel'},
            {separator: true},
            {
                label: 'Cancel Lesson',
                icon: 'pi pi-times',
                styleClass: 'text-red-500',
                tooltip: 'Cancel this lesson',
            },
            {
                label: 'Reschedule Lesson',
                icon: 'pi pi-calendar',
                tooltip: 'Reschedule this lesson',
            },
        ];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    protected LessonStatus = LessonStatus;
}
