import {CommonModule} from '@angular/common';
import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {SelectItem} from 'primeng/api';
import {LEVELS} from 'src/app/shared/constants/app';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {GlobalTable} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {Router, RouterModule} from '@angular/router';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {RippleModule} from "primeng/ripple";
import {lessonsActions} from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import * as LessonsActions from "../../../../../../core/store/schoolar/lessons/lessons.selectors";
import {LESSON_COLUMNS, LESSONS_GLOBAL_FILTER_FIELDS} from "./lessons.constants";
import {LessonState} from "../../../../../../core/store/schoolar/lessons/lesson.state";

@Component({
    selector: 'app-lessons',
    imports: [
        GlobalTable,
        DialogModule,
        ToastModule,
        CommonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        ButtonModule,
        RouterModule,
        ChartModule,
        CardModule,
        RippleModule
    ],
    templateUrl: './lessons-list.component.html'
})
export class LessonsListComponent implements OnInit, OnDestroy, AfterViewInit {
    lesson: Lesson = {} as Lesson;

    lessons$: Observable<Lesson[]>;

    classes: Lesson[] = [];

    loading$: Observable<boolean>;

    selected: SelectItem[] = [];

    types: any[] = ['VIP', 'Online', 'In Center'];

    levels = LEVELS;

    columns: any[] = LESSON_COLUMNS;

    globalFilterFields: string[] = LESSONS_GLOBAL_FILTER_FIELDS;

    @ViewChild("startDatetime", {static: true})
    startDatetimeTemplate?: TemplateRef<any>;

    @ViewChild("endDatetime", {static: true})
    endDatetimeTemplate?: TemplateRef<any>;

    @ViewChild("actionsTemplate", {static: true})
    actionsTemplate?: TemplateRef<any>;

    columnTemplates: Record<string, TemplateRef<any>> = {}

    private destroy$ = new Subject<void>();

    constructor(
        private store: Store<LessonState>,
        private router: Router
    ) {
        this.lessons$ = store.select(LessonsActions.selectAllLessons)
        this.loading$ = store.select(LessonsActions.selectLoadingLessons);
    }

    ngOnInit(): void {
        this.store.dispatch(lessonsActions.loadLessons());
    }

    ngAfterViewInit() {
        this.columnTemplates = {
            startDatetime: this.startDatetimeTemplate!,
            endDatetime: this.endDatetimeTemplate!,
            actions: this.actionsTemplate!,
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    navigateToCreateLesson() {
        this.router.navigate(['/schoolar/lessons/create']).then();
    }

    /**
     * Format date for display
     */
    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
}
