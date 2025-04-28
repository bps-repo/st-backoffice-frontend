import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { Class } from 'src/app/core/models/academic/class';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectItem } from 'primeng/api';
import { LEVELS } from 'src/app/shared/constants/app';
import { INSTALATIONS } from 'src/app/shared/constants/representatives';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ClassesService } from '../../../../../../core/services/classes.service';
import { GlobalTable } from 'src/app/shared/components/tables/global-table/global-table.component';
import { Store } from '@ngrx/store';
import { lessonsActions } from 'src/app/core/store/schoolar';
import { Subject, takeUntil } from 'rxjs';
import {selectAllClasses, selectLoadingClass} from "../../../../../../core/store/schoolar/selectors/classes.selectors";

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
    ],
    templateUrl: './lesson.component.html'
})
export class LessonComponent implements OnInit, OnDestroy {
    lesson: Lesson = {} as Lesson;
    lessons: Lesson[] = [];
    lessonToCreate: Lesson = {} as Lesson;
    classes: Lesson[] = [];
    loading = false;

    instalations: any[] = INSTALATIONS;
    selected: SelectItem[] = [];
    types: any[] = ['VIP', 'Online', 'In Center'];
    levels = LEVELS;
    columns: any[] = [];
    globalFilterFields: string[] = [];
    createClassDialog: boolean = false;
    deleteClasstDialog: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private classeService: ClassesService,
        private store: Store
    ) {
        this.columns = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Turma' },
            { field: 'startDate', header: 'Data Início' },
            { field: 'endDate', header: 'Data Fim' },
            { field: 'teacher.name', header: 'Professor' },
            { field: 'center.name', header: 'Centro' },
            { field: 'level.name', header: 'Nível' },
            { field: 'status', header: 'Status' },
            { field: 'maxCapacity', header: 'Capacidade' },
        ];
    }

    ngOnInit(): void {
        // Subscribe to dialog state
        this.classeService.createClassDialog$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.createClassDialog = state;
            });

        this.classeService.deleteClassDialog$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.deleteClasstDialog = state;
            });

        // Dispatch action to load lessons
        this.store.dispatch(lessonsActions.loadLessons());

        // Subscribe to lessons from store
        this.store.select(selectAllClasses)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classes => {
                this.classes = classes;
            });

        // Subscribe to loading state
        this.store.select(selectLoadingClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.loading = loading;
            });
    }

    ngOnDestroy(): void {
        this.classeService.setCreateClassDialogState(false);
        this.classeService.setDeleteClassDialogState(false);
        this.destroy$.next();
        this.destroy$.complete();
    }

    saveClass(): void {
        if (this.lessonToCreate.id) {
            this.store.dispatch(lessonsActions.updateLesson({ lesson: this.lessonToCreate }));
        } else {
            this.store.dispatch(lessonsActions.createLesson({ lesson: this.lessonToCreate }));
        }
        this.hideDialog();
    }

    hideDialog() {
        this.classeService.setCreateClassDialogState(false);
        this.classeService.setDeleteClassDialogState(false);
        this.lessonToCreate = {} as Lesson;
    }

    confirmDelete() {
        if (this.lessonToCreate.id) {
            this.store.dispatch(lessonsActions.deleteLesson({ id: this.lessonToCreate.id }));
        }
        this.hideDialog();
    }
}

