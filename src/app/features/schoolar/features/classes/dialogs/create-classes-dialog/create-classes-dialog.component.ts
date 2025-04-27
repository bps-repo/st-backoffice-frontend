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
import { ClassesService } from '../../services/classes.service';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { Store } from '@ngrx/store';
import { classesActions } from 'src/app/core/store/schoolar';
import { Subject, takeUntil } from 'rxjs';
import {selectAllClasses, selectLoadingClass} from "../../../../../../core/store/schoolar/selectors/classes.selectors";

@Component({
    selector: 'app-classes',
    imports: [
        TableWithFiltersComponent,
        DialogModule,
        ToastModule,
        CommonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        ButtonModule,
    ],
    templateUrl: './create-classes-dialog.component.html'
})
export class CreateClassesDialogComponent implements OnInit, OnDestroy {
    lesson: Lesson = {} as Lesson;
    lessons: Lesson[] = [];
    classToCreate: Class = {} as Class;
    classes: Class[] = [];
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

        // Dispatch action to load classes
        this.store.dispatch(classesActions.loadClasses());

        // Subscribe to classes from store
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
        if (this.classToCreate.id) {
            this.store.dispatch(classesActions.updateClass({ class: this.classToCreate }));
        } else {
            this.store.dispatch(classesActions.createClass({ class: this.classToCreate }));
        }
        this.hideDialog();
    }

    hideDialog() {
        this.classeService.setCreateClassDialogState(false);
        this.classeService.setDeleteClassDialogState(false);
        this.classToCreate = {} as Class;
    }

    confirmDelete() {
        if (this.classToCreate.id) {
            this.store.dispatch(classesActions.deleteClass({ id: this.classToCreate.id }));
        }
        this.hideDialog();
    }
}

