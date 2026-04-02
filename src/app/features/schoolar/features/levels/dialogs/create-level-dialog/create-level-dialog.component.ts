import {CommonModule} from '@angular/common';
import {Component, OnInit, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {Level} from 'src/app/core/models/course/level';
import {Store} from '@ngrx/store';
import {Observable, take} from 'rxjs';
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Actions, ofType} from '@ngrx/effects';
import {ShowToastErrorService} from '../../../../../../shared/services/show-toast-error-service';

@Component({
    selector: 'app-create-level-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        ToastModule
    ],
    templateUrl: './create-level-dialog.component.html',
    providers: [MessageService]
})
export class CreateLevelDialogComponent implements OnInit {
    private store = inject(Store);
    private messageService = inject(MessageService);
    private actions$ = inject(Actions);
    visible: boolean = false;
    level: Partial<Level> = {
        name: '',
        description: '',
        duration: 0,
        maximumUnits: 0,
    };


    loading$: Observable<boolean>;
    loadingCreate$: Observable<boolean>;
    error$: Observable<any>;

    //courseOptions$: Observable<Service[]>;

    constructor() {
        this.loading$ = this.store.select(LevelSelectors.selectLoading);
        this.loadingCreate$ = this.store.select(LevelSelectors.selectLevelCreateLoading);
        this.error$ = this.store.select(LevelSelectors.selectError);
    }

    ngOnInit() {
        // Keep for potential error logging; real feedback handled in saveLevel via actions
        this.error$.subscribe((error) => {
            if (error) {
                console.error('Erro ao criar o Level:', error);
            }
        });
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    saveLevel() {
        // Basic validation
        if (!this.level.name || (this.level.name || '').trim().length === 0) {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: 'O nome do nível é obrigatório'});
            return;
        }

        const payload = {
            name: this.level.name,
            description: this.level.description,
            duration: this.level.duration,
            maximumUnits: this.level.maximumUnits,
        } as Partial<Level>;

        this.store.dispatch(LevelActions.createLevel({level: payload}));

        // Wait for success once
        this.actions$.pipe(ofType(LevelActions.createLevelSuccess), take(1)).subscribe(() => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Nível criado com sucesso'});
            this.hide();
            this.resetForm();
        });

        // Handle failure once
        this.actions$.pipe(ofType(LevelActions.createLevelFailure), take(1)).subscribe(({error}: any) => {
            ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Falha ao criar nível');
        });
    }

    resetForm() {
        this.level = {
            name: '',
            description: '',
            duration: 0,
            maximumUnits: 0,
            //course: undefined
        };
    }
}
