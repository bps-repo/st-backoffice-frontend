import {CommonModule} from '@angular/common';
import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {SelectButtonModule} from 'primeng/selectbutton';
import {TooltipModule} from 'primeng/tooltip';
import {lessonsActions} from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import * as LessonsActions from "../../../../../../core/store/schoolar/lessons/lessons.selectors";
import {LESSON_COLUMNS, LESSONS_GLOBAL_FILTER_FIELDS} from "./lessons.constants";
import {LessonState} from "../../../../../../core/store/schoolar/lessons/lesson.state";
import {LessonReports} from "../../../reports/components/lessons/lesson-reports.component";

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
        RippleModule,
        SelectButtonModule,
        TooltipModule,
        LessonReports
    ],
    templateUrl: './lessons-list.component.html',
    styles: [`
        ::ng-deep .p-selectbutton {
            display: flex;
            flex-wrap: nowrap;
        }

        ::ng-deep .p-selectbutton .p-button {
            margin-right: 0.5rem;
            border: none;
        }

        ::ng-deep .p-selectbutton .p-button:last-child {
            margin-right: 0;
        }

        .sticky-header {
            position: sticky;
            top: 0;
            z-index: 100;
            padding-top: 1rem;
            padding-bottom: 1rem;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .sticky-active {
            background-color: var(--surface-card);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .animate-fade {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .content-sticky {
            position: sticky;
            top: 140px;
            z-index: 90;
        }
    `]
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

    // View selection
    currentView: string = 'list'; // Default view is list

    viewOptions = [
        { label: 'Lista de aulas', value: 'list' },
        { label: 'Calendario', value: 'calendario' },
        { label: 'Relatorios', value: 'relatorios' },
        { label: 'Estatisticas', value: 'estatisticas' }
    ];

    // References to sticky header elements
    @ViewChild('mainHeader', {static: false})
    mainHeader!: ElementRef;

    @ViewChild('viewSelector', {static: false})
    viewSelector!: ElementRef;

    // Sticky state tracking
    isMainHeaderSticky: boolean = false;
    isViewSelectorSticky: boolean = false;

    @ViewChild("startDatetime", {static: true})
    startDatetimeTemplate?: TemplateRef<any>;

    @ViewChild("endDatetime", {static: true})
    endDatetimeTemplate?: TemplateRef<any>;

    @ViewChild("actionsTemplate", {static: true})
    actionsTemplate?: TemplateRef<any>;

    columnTemplates: Record<string, TemplateRef<any>> = {}

    private destroy$ = new Subject<void>();

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
    }

    // Listen for scroll events
    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        this.checkStickyState();
    }

    // Check if headers are in sticky state
    checkStickyState() {
        if (this.mainHeader && this.mainHeader.nativeElement) {
            const mainHeaderRect = this.mainHeader.nativeElement.getBoundingClientRect();
            // Header is sticky when its top position is 0
            this.isMainHeaderSticky = mainHeaderRect.top <= 0;
        }

        if (this.viewSelector && this.viewSelector.nativeElement) {
            const viewSelectorRect = this.viewSelector.nativeElement.getBoundingClientRect();
            // View selector is sticky when its top position is at its sticky position (80px)
            this.isViewSelectorSticky = viewSelectorRect.top <= 80;
        }
    }

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

        // Initialize sticky state check after view is initialized
        setTimeout(() => {
            this.checkStickyState();
        });
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
