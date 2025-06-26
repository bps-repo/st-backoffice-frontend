import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {CreateUnitDialogComponent} from '../../dialogs/create-unit-dialog/create-unit-dialog.component';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableColumn, GlobalTable} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Unit} from 'src/app/core/models/course/unit';
import {Level} from 'src/app/core/models/course/level';
import {selectAllUnits} from "../../../../../../core/store/schoolar/units/unit.selectors";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {UnitActions} from "../../../../../../core/store/schoolar/units/unit.actions";

@Component({
    selector: 'app-unit-general',
    imports: [CommonModule, GlobalTable, ConfirmDialogModule, ButtonModule, CreateUnitDialogComponent],
    templateUrl: './list.component.html',
    standalone: true,
    providers: [ConfirmationService]
})
export class ListComponent implements OnInit {

    @ViewChild(CreateUnitDialogComponent) createUnitDialog!: CreateUnitDialogComponent;

    units$: Observable<Unit[]>;
    loading$: Observable<boolean> = of();
    units: Unit[] = [];
    levels: Level[] = [];

    columns: TableColumn[] = [];
    size = 10;

    constructor(
        private router: Router,
        private store: Store,
        private confirmationService: ConfirmationService
    ) {
        this.units$ = this.store.select(selectAllUnits);
        //this.loading$ = this.store.select(selectUnitLoading);
    }

    ngOnInit(): void {
        this.loadUnits();
        this.store.dispatch(LevelActions.loadLevels());

        // Carrega níveis e unidades em memória e cruza os dados
        // this.store.select(sel).subscribe(levels => {
        //     this.levels = levels;
        //     this.mapLevelNames();
        // });

        this.units$.subscribe(units => {
            this.units = units;
            this.mapLevelNames();
        });

        this.columns = [
            {field: 'id', header: 'ID', filterType: 'text'},
            {field: 'name', header: 'Nome', filterType: 'text'},
            {field: 'description', header: 'Descrição', filterType: 'text'},
            {field: 'orderUnit', header: 'Unidade de pedido', filterType: 'numeric'},
            {field: 'levelName', header: 'Nível', filterType: 'text'},
            {field: 'actions', header: 'Ações', customTemplate: true},
        ];
    }

    loadUnits(): void {
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
                this.store.dispatch(UnitActions.deleteUnit({id: unit.id}));
            },
            reject: () => {
                console.log('Ação de exclusão cancelada.');
            }
        });
    }
}
