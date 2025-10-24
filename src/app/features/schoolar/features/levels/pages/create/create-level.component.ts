import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Store} from '@ngrx/store';
import {Observable, Subject, take, takeUntil} from 'rxjs';
import {Level} from 'src/app/core/models/course/level';
import * as LevelSelectors from '../../../../../../core/store/schoolar/level/level.selector';
import {LevelActions} from '../../../../../../core/store/schoolar/level/level.actions';
import {Actions, ofType} from '@ngrx/effects';

@Component({
    selector: 'app-create-level',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        ToastModule
    ],
    templateUrl: './create-level.component.html',
    providers: [MessageService]
})
export class CreateLevelComponent implements OnInit, OnDestroy {
    levelForm: FormGroup;

    loading$: Observable<boolean>;
    loadingCreate$: Observable<boolean>;
    error$: Observable<any>;

    colorOptions = [
        { label: 'Azul', value: '#3B82F6', color: '#3B82F6' },
        { label: 'Verde', value: '#10B981', color: '#10B981' },
        { label: 'Vermelho', value: '#EF4444', color: '#EF4444' },
        { label: 'Amarelo', value: '#F59E0B', color: '#F59E0B' },
        { label: 'Roxo', value: '#8B5CF6', color: '#8B5CF6' },
        { label: 'Rosa', value: '#EC4899', color: '#EC4899' },
        { label: 'Cinza', value: '#6B7280', color: '#6B7280' }
    ];

    statusOptions = [
        { label: 'Ativo', value: 'ACTIVE' },
        { label: 'Inativo', value: 'INACTIVE' },
        { label: 'Rascunho', value: 'DRAFT' }
    ];

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private store: Store,
        private messageService: MessageService,
        private actions$: Actions
    ) {
        this.levelForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            order: [1, [Validators.required, Validators.min(1)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            color: ['#3B82F6', Validators.required],
            status: ['ACTIVE', Validators.required],
            duration: [0, [Validators.required, Validators.min(0)]],
            maximumUnits: [0, [Validators.required, Validators.min(0)]]
        });

        this.loading$ = this.store.select(LevelSelectors.selectLoading);
        this.loadingCreate$ = this.store.select(LevelSelectors.selectLevelCreateLoading);
        this.error$ = this.store.select(LevelSelectors.selectError);
    }

    ngOnInit() {
        this.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
            if (error) {
                console.error('Erro ao criar o Level:', error);
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    saveLevel() {
        if (this.levelForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor, preencha todos os campos obrigatórios'
            });
            return;
        }

        const formValue = this.levelForm.value;
        const payload: Partial<Level> = {
            name: formValue.name,
            description: formValue.description,
            duration: formValue.duration,
            maximumUnits: formValue.maximumUnits,
            // Add additional fields if needed
            // order: formValue.order,
            // color: formValue.color,
            // status: formValue.status
        };

        this.store.dispatch(LevelActions.createLevel({level: payload}));

        // Wait for success
        this.actions$.pipe(ofType(LevelActions.createLevelSuccess), take(1)).subscribe(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Nível criado com sucesso'
            });
            this.router.navigate(['/schoolar/levels']);
        });

        // Handle failure
        this.actions$.pipe(ofType(LevelActions.createLevelFailure), take(1)).subscribe(({error}: any) => {
            const messages = (error || '').toString().split(' | ').filter((m: string) => !!m);
            if (messages.length === 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao criar nível'
                });
            } else {
                messages.forEach((msg: string) => this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: msg
                }));
            }
        });
    }

    cancel() {
        this.router.navigate(['/schoolar/levels']);
    }

    getColorPreview(color: string): string {
        return color;
    }
}
