import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {Unit} from 'src/app/core/models/course/unit';
import {Level} from 'src/app/core/models/course/level';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import * as UnitSelectors from "../../../../../../core/store/schoolar/units/unit.selectors";
import {UnitActions} from "../../../../../../core/store/schoolar/units/unit.actions";

@Component({
    selector: 'app-create-unit-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule
    ],
    templateUrl: './create-unit-dialog.component.html'
})
export class CreateUnitDialogComponent implements OnInit {

    visible: boolean = false;

    unit: Partial<Unit> = {
        name: '',
        description: '',
        orderUnit: 0,
        maximumAssessmentAttempt: 0,
        level: undefined
    };


    loading$: Observable<boolean>;
    error$: Observable<any>;
    levelOptions$: Observable<Level[]>;

    constructor(private store: Store) {
        this.loading$ = this.store.select(UnitSelectors.selectLoading);
        this.error$ = this.store.select(UnitSelectors.selectError);
        this.levelOptions$ = of();
    }

    ngOnInit() {
        this.error$.subscribe((error) => {
            if (error) {
                console.error('Erro ao criar o Unit:', error);
            }
        });
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    saveUnit() {

        if (!this.unit.level?.id) {
            console.error('LevelId é obrigatório');
            return;
        }

        const payload = {
            name: this.unit.name,
            description: this.unit.description,
            orderUnit: this.unit.orderUnit,
            maximumAssessmentAttempt: this.unit.maximumAssessmentAttempt,
            levelId: this.unit.level?.id
        };
        console.log('Payload:', payload);

        this.store.dispatch(UnitActions.createUnit({unit: payload}));

        // this.store.select(selectUnitError).subscribe(error => {
        //     if (!error) {
        //         this.hide();
        //         this.resetForm();
        //     }
        // });
    }

    resetForm() {
        this.unit = {
            name: '',
            description: '',
            orderUnit: 0,
            maximumAssessmentAttempt: 0,
            level: undefined
        };
    }
}
