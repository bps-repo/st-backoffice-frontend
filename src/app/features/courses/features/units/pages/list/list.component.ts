import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, startWith } from 'rxjs';
import { CreateUnitDialogComponent } from '../../dialogs/create-unit-dialog/create-unit-dialog.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableColumn, GlobalTable } from 'src/app/shared/components/tables/global-table/global-table.component';
import * as UnitActions from 'src/app/core/store/course/actions/unit.actions';
import * as LevelActions from 'src/app/core/store/course/actions/level.actions';
import { selectAllUnits, selectUnitLoading } from 'src/app/core/store/course/selectors/unit.selector';
import { selectAllLevels } from 'src/app/core/store/course/selectors/level.selector';
import { Unit } from 'src/app/core/models/course/unit';
import { Level } from 'src/app/core/models/course/level';

@Component({
    selector: 'app-unit-list',
    imports: [CommonModule, GlobalTable, ConfirmDialogModule, ButtonModule, CreateUnitDialogComponent],
    templateUrl: './list.component.html',
    standalone: true,
    providers: [ConfirmationService]
})
export class ListComponent implements OnInit {

    @ViewChild(CreateUnitDialogComponent) createUnitDialog!: CreateUnitDialogComponent;

    units$: Observable<Unit[]>;
    loading$: Observable<boolean>;
    units: Unit[] = [];
    levels: Level[] = [];

    columns: TableColumn[] = [];
    size = 10;

    constructor(
        private router: Router,
        private store: Store,
        private confirmationService: ConfirmationService
    ) {
        this.units$ = this.store.select(selectAllUnits).pipe(startWith([]));
        this.loading$ = this.store.select(selectUnitLoading);
    }

    ngOnInit(): void {
        this.loadUnits();
        this.store.dispatch(LevelActions.loadLevels()); // Carrega os níveis

        // Carrega níveis e unidades em memória e cruza os dados
        this.store.select(selectAllLevels).subscribe(levels => {
            this.levels = levels;
            this.mapLevelNames();
        });

        this.units$.subscribe(units => {
            this.units = units;
            this.mapLevelNames();
        });

        this.columns = [
            { field: 'id', header: 'ID', filterType: 'text' },
            { field: 'name', header: 'Nome', filterType: 'text' },
            { field: 'description', header: 'Descrição', filterType: 'text' },
            { field: 'orderUnit', header: 'Unidade de pedido', filterType: 'numeric' },
            { field: 'levelName', header: 'Nível', filterType: 'text' },
            { field: 'actions', header: 'Ações', customTemplate: true },
        ];
    }

    loadUnits(): void {
        this.store.dispatch(UnitActions.loadPagedUnits({ size: this.size }));
    }

    mapLevelNames(): void {
        if (!this.units || !this.levels) return;

        this.units = this.units.map(unit => {
            const level = this.levels.find(l => l.id === unit.levelId);
            return {
                ...unit,
                level: level ?? null,
                levelName: level?.name ?? 'Nível não encontrado'
            };
        });
    }

    viewDetails(unit: Unit): void {
        this.router.navigate(['/courses/units', unit.id]);
    }

    createUnit(): void {
        this.createUnitDialog.show();
    }

    deleteUnit(unit: Unit): void {
        this.confirmationService.confirm({
            message: `Tem certeza de que deseja excluir a unidade "${unit.name}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle text-warning',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.store.dispatch(UnitActions.deleteUnit({ id: unit.id }));
            },
            reject: () => {
                console.log('Ação de exclusão cancelada.');
            }
        });
    }
}
