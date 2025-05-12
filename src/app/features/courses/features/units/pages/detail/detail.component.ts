// detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as UnitActions from 'src/app/core/store/course/actions/unit.actions';
import { selectSelectedUnit, selectUnitLoading } from 'src/app/core/store/course/selectors/unit.selector';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Unit } from 'src/app/core/models/course/unit';
import * as LevelActions from 'src/app/core/store/course/actions/level.actions';
import { selectAllLevels } from 'src/app/core/store/course/selectors/level.selector';
import { Level } from 'src/app/core/models/course/level';

@Component({
    selector: 'app-unit-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        FormsModule,
        ProgressSpinnerModule
    ]
})
export class DetailComponent implements OnInit {

    unitId: string = '';
    unit$: Observable<Unit | null>;
    unit: Unit | null = null;
    editableUnit: Unit | null = null;
    loading$: Observable<boolean>;
    loading: boolean = true;
    levels: Level[] = [];


    constructor(private route: ActivatedRoute, private store: Store) {
        this.unit$ = this.store.select(selectSelectedUnit);
        this.loading$ = this.store.select(selectUnitLoading);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.unitId = params['id'];
            this.loadUnit();
        });

        // Carrega níveis
        this.store.dispatch(LevelActions.loadLevels());

        this.store.select(selectAllLevels).subscribe(levels => {
            this.levels = levels;
            this.setUnitLevel();
        });

        this.unit$.subscribe(unit => {
            this.unit = unit;
            this.editableUnit = unit ? { ...unit } : null;
            this.setUnitLevel();
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });
    }

    loadUnit(): void {
        this.store.dispatch(UnitActions.loadUnit({ id: this.unitId }));
    }

    editUnit(): void {

        if (this.editableUnit) {
            const updatedUnit: any = {
                name: this.editableUnit.name,
                description: this.editableUnit.description,
                orderUnit: this.editableUnit.orderUnit,

            };

            this.store.dispatch(UnitActions.updateUnit({ id: this.unitId, unit: updatedUnit }));
        }
    }

    setUnitLevel(): void {
        if (this.unit && this.levels.length > 0) {
            const matchedLevel = this.levels.find(l => l.id === this.unit?.levelId);
            if (matchedLevel) {
                this.unit = {
                    ...this.unit,
                    level: matchedLevel
                };
                this.editableUnit = { ...this.unit };
            }
        }
    }

    downloadUnitDetails(): void {
        console.log('Downloading unit details:', this.unit);
        alert('Download dos detalhes do Nível iniciado');
    }

    sendUnitDetails(): void {
        console.log('Sending unit details:', this.unit?.name);
        alert('Detalhes do Nível enviados para ' + this.unit?.name);
    }
}
