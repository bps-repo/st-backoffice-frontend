import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {filter, Observable, Subject, takeUntil} from 'rxjs';
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";

@Component({
    selector: 'app-create-level-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        ToastModule
    ],
    templateUrl: './create-level-dialog.component.html',
    providers: [MessageService]
})
export class CreateLevelDialogComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    visible: boolean = false;
    levelForm!: FormGroup;

    loading$!: Observable<boolean>;
    error$!: Observable<any>;

    constructor(private store: Store,
                private fb: FormBuilder,
                private readonly messageService: MessageService) {
        this.initObservables();
        this.subscribeToStateChanges();
    }

    ngOnInit() {
        this.initForm();

        this.error$.subscribe((error) => {
            if (error) {
                console.error('Erro ao criar o Level:', error);
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm() {
        this.levelForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            duration: [0, [Validators.required, Validators.min(1)]],
            maximumUnits: [0, [Validators.required, Validators.min(1)]]
        });
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    private initObservables() {
        this.loading$ = this.store.select(LevelSelectors.selectLoadingCreate);
        this.error$ = this.store.select(LevelSelectors.selectLevelCreateError);
    }

    private subscribeToStateChanges() {
        this.store.select(LevelSelectors.selectCreateLevelSuccess).subscribe(success => {
            if (success) {
                this.hide();
                this.levelForm.reset();
                this.levelForm.patchValue({duration: 0, maximumUnits: 0});
                this.showSuccessToast();
            }
        });

        this.error$
            .pipe(
                takeUntil(this.destroy$),
                filter(error => !!error)
            )
            .subscribe(error => {
                this.showErrorToast(error);
            });
    }

    protected saveLevel() {
        if (this.levelForm.valid) {
            const payload = this.levelForm.value;
            this.store.dispatch(LevelActions.createLevel({level: payload}));
        } else {
            this.levelForm.markAllAsTouched();

            this.showWarnToast('Por favor, preencha todos os campos obrigatórios.');
        }
    }

    private showWarnToast(warn: any) {
        const errorMessage = warn || 'Tente novamente.';

        this.messageService.add({
            severity: 'warn',
            summary: 'Atenção!',
            detail: errorMessage ?? 'Preencha os campos obrigatórios.',
            life: 6000
        });
    }

    private showErrorToast(error: any) {
        const errorMessage = error || 'Erro ao criar estudante. Tente novamente.';

        this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: errorMessage,
            life: 6000
        });
    }

    private showSuccessToast() {
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Nível criado com sucesso.',
            life: 4000
        });
    }
}
