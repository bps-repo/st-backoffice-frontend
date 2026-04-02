import {CommonModule} from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Store} from '@ngrx/store';
import {Observable, Subject, take, takeUntil} from 'rxjs';
import {Level} from 'src/app/core/models/course/level';
import {Unit} from 'src/app/core/models/course/unit';
import * as LevelSelectors from '../../../../../../core/store/schoolar/level/level.selector';
import * as UnitSelectors from '../../../../../../core/store/schoolar/units/unit.selectors';
import {UnitActions} from '../../../../../../core/store/schoolar/units/unit.actions';
import {Actions, ofType} from '@ngrx/effects';
import {ShowToastErrorService} from '../../../../../../shared/services/show-toast-error-service';

@Component({
    selector: 'app-create-unit',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        ToastModule
    ],
    templateUrl: './create-unit.component.html',
    providers: [MessageService]
})
export class CreateUnitComponent implements OnInit, OnDestroy {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private store = inject(Store);
    private messageService = inject(MessageService);
    private actions$ = inject(Actions);

    unitForm: FormGroup;

    levels$: Observable<Level[]>;
    loading$: Observable<boolean>;
    error$: Observable<any>;

    statusOptions = [
        {label: 'Ativo', value: 'ACTIVE'},
        {label: 'Inativo', value: 'INACTIVE'},
        {label: 'Rascunho', value: 'DRAFT'}
    ];

    private destroy$ = new Subject<void>();

    constructor() {
        this.unitForm = this.fb.group({
            levelId: [null, Validators.required],
            orderUnit: [1, [Validators.required, Validators.min(1)]],
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', [Validators.required, Validators.minLength(5)]],
            estimatedHours: [20, [Validators.required, Validators.min(0)]],
            status: ['ACTIVE', Validators.required],
            maximumAssessmentAttempt: [1, [Validators.required, Validators.min(1)]]
        });

        this.levels$ = this.store.select(LevelSelectors.selectAllLevels);
        this.loading$ = this.store.select(UnitSelectors.selectLoading);
        this.error$ = this.store.select(UnitSelectors.selectError);
    }

    ngOnInit(): void {
        // ensure levels list is available
        this.store.dispatch({type: '[Level] Load Levels'} as any);
        this.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
            if (error) console.error('Erro ao criar unidade:', error);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    saveUnit(): void {
        if (this.unitForm.invalid) {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Preencha os campos obrigatórios'});
            return;
        }

        const v = this.unitForm.value;
        const payload: Partial<Unit> = {
            name: v.name,
            description: v.description,
            orderUnit: v.orderUnit,
            maximumAssessmentAttempt: v.maximumAssessmentAttempt,
            levelId: v.levelId,
        } as any;

        this.store.dispatch(UnitActions.createUnit({unit: payload}));

        this.actions$.pipe(ofType(UnitActions.createUnitSuccess), take(1)).subscribe(() => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Unidade criada com sucesso'});
            this.router.navigate(['/schoolar/units']);
        });

        this.actions$.pipe(ofType(UnitActions.createUnitFailure), take(1)).subscribe(({error}: any) => {
            ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Falha ao criar unidade');
        });
    }

    cancel(): void {
        this.router.navigate(['/schoolar/units']);
    }
}


