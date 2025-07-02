// class-create.component.ts
import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from "primeng/toast";
import {MessageService, SelectItem} from "primeng/api";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";
import {Store} from "@ngrx/store";
import {selectAllCenters} from "../../../../../../core/store/corporate/center/centers.selector";
import {distinctUntilChanged, filter, Observable, Subject, takeUntil} from "rxjs";
import {selectAllLevels} from "../../../../../../core/store/schoolar/level/level.selector";
import {
    selectCreateClassSuccess,
    selectCreateError,
    selectLoadingCreate
} from "../../../../../../core/store/schoolar/classes/classes.selectors";
import {ClassesActions} from "../../../../../../core/store/schoolar/classes/classesActions";

@Component({
    selector: 'app-create',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule,
        ToastModule
    ],
    templateUrl: './class-create.component.html',
    providers: [MessageService]
})
export class ClassCreateComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    createSuccess$!: Observable<boolean>;

    errors$!: Observable<any>;

    loading$!: Observable<boolean>;

    classForm!: FormGroup;

    levels: SelectItem[] = [];

    centers: SelectItem[] = [];

    statuses = [
        {label: 'Activo', value: 'ACTIVE'},
        {label: 'Inactivo', value: 'CANCELLED'}
    ];

    constructor(private fb: FormBuilder,
                private readonly messageService: MessageService,
                private readonly store: Store
    ) {
        this.createSuccess$ = this.store.select(selectCreateClassSuccess)
        this.loading$ = this.store.select(selectLoadingCreate)
        this.errors$ = this.store.select(selectCreateError)
        this.subscribeToStateChanges()
    }

    ngOnInit() {
        this.initForm();
        this.store.dispatch(LevelActions.loadLevels())
        this.store.dispatch(CenterActions.loadCenters())
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private subscribeToStateChanges() {
        // Subscribe to centers data
        this.store.select(selectAllCenters)
            .pipe(takeUntil(this.destroy$))
            .subscribe(centers => {
                this.centers = centers.map(center => ({
                    label: center.name,
                    value: center.id
                }));
            });

        // Subscribe to levels data
        this.store.select(selectAllLevels)
            .pipe(takeUntil(this.destroy$))
            .subscribe(levels => {
                this.levels = levels.map(level => ({
                    label: level.name,
                    value: level.id
                }));
            });

        // Subscribe to create success state
        this.createSuccess$
            .pipe(
                takeUntil(this.destroy$),
                filter(success => success === true),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.showSuccessToast();
                this.resetForm();
            });

        // Subscribe to errors
        this.errors$
            .pipe(
                takeUntil(this.destroy$),
                filter(error => !!error)
            )
            .subscribe(error => {
                this.showErrorToast(error);
            });
    }

    private initForm() {
        this.classForm = this.fb.group({
            name: ['', [Validators.required]],
            code: ['290293', [Validators.required]],
            levelId: [null, [Validators.required]],
            centerId: [null, [Validators.required]],
            maxCapacity: [15, [Validators.min(1), Validators.max(100)]],
            status: ['ACTIVE']
        });
    }

    private showSuccessToast() {
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Turma criada com sucesso.',
            life: 4000
        });
    }

    private showErrorToast(error: any) {
        const errorMessage = error || 'Erro ao criar turma. Tente novamente.';

        this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: errorMessage,
            life: 6000
        });
    }

    saveClass() {
        if (this.classForm.valid) {
            let classData = {...this.classForm.value}
            // In a real application, you would save the class data using a service
            console.log('Class saved:', this.classForm.value);
            this.store.dispatch(ClassesActions.createClass({classData: classData}))
        } else {
            this.markFormGroupTouched();
        }
    }

    private markFormGroupTouched() {
        Object.keys(this.classForm.controls).forEach(key => {
            const control = this.classForm.get(key);
            control?.markAsTouched();
        });
    }

    // Helper methods for template validation
    isFieldInvalid(fieldName: string): boolean {
        const field = this.classForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.classForm.get(fieldName);
        if (field?.errors) {
            if (field.errors['required']) {
                return `${fieldName} é obrigatório`;
            }
            if (field.errors['min']) {
                return `${fieldName} deve conter pelo menos ${field.errors['min'].min}`;
            }
            if (field.errors['max']) {
                return `${fieldName} deve conter no máximo ${field.errors['max'].max}`;
            }
        }
        return '';
    }

    private resetForm() {
        this.classForm.reset();
    }
}
