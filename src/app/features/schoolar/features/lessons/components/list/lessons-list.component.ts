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
import {LessonStatus} from "../../../../../../core/enums/lesson-status";
import {BadgeModule} from "primeng/badge";
import {selectUnitById} from "../../../../../../core/store/schoolar/units/unit.selectors";
import {take} from "rxjs/operators";
import {selectCenterById} from "../../../../../../core/store/corporate/center/centers.selector";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";
import {UnitActions} from "../../../../../../core/store/schoolar/units/unit.actions";
import {ProgressSpinnerModule} from "primeng/progressspinner";

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
        BadgeModule,
        ProgressSpinnerModule
    ],
    templateUrl: './lessons-list.component.html'
})
export class LessonsListComponent implements OnInit, OnDestroy, AfterViewInit {
    lesson: Lesson = {} as Lesson;

    lessons$: Observable<Lesson[]>;

    classes: Lesson[] = [];

    loading$: Observable<boolean>;

    error$: Observable<string | null> = this.store.select(LessonsActions.selectError);


    selected: SelectItem[] = [];

    types: any[] = ['VIP', 'Online', 'In Center'];

    levels = LEVELS;

    columns: any[] = LESSON_COLUMNS;

    globalFilterFields: string[] = LESSONS_GLOBAL_FILTER_FIELDS;

    private destroy$ = new Subject<void>();

    constructor(
        private store: Store<LessonState>,
        private router: Router
    ) {
        this.lessons$ = store.select(LessonsActions.selectAllLessons)
        this.loading$ = store.select(LessonsActions.selectLoadingLessons);
    }

    ngOnInit(): void {
        this.store.dispatch(CenterActions.loadCenters())
        this.store.dispatch(UnitActions.loadUnits())
        this.store.dispatch(lessonsActions.loadLessons());
    }

    ngAfterViewInit() {
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

    protected LessonStatus = LessonStatus


    getLessonStatusLabel(status: LessonStatus): string {
        switch (this.lesson.status) {
            case LessonStatus.AVAILABLE:
                return 'Disponível';
            case LessonStatus.OVERDUE:
                return 'Passado';
            case LessonStatus.COMPLETED:
                return 'Concluída';
            case LessonStatus.BOOKED:
                return 'Agendada';
            default:
                return 'Desconhecida';
        }
    }

    getLessonStatusSeverity(status: LessonStatus) {
        switch (status) {
            case LessonStatus.AVAILABLE:
                return 'info';
            case LessonStatus.OVERDUE:
                return 'danger';
            case LessonStatus.COMPLETED:
                return 'success';
            case LessonStatus.BOOKED:
                return 'warning';
            default:
                return null;
        }
    }

    getCenterName(centerId: any) {
        let centerName = '';
        this.store.select(selectCenterById(centerId)).pipe(
            take(1)
        ).subscribe(center => {
            centerName = center?.name ?? 'Centro não encontrado';
        });
        return centerName;
    }

    getUnitName(unitId: any) {
        let unitName = '';
        this.store.select(selectUnitById(unitId)).pipe(
            take(1)
        ).subscribe(unit => {
            unitName = unit?.name ?? 'Unidade não encontrada';
        });
        return unitName;
    }

    getTeacherName(teacherId: any) {
        return "";
    }
}
