import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import * as UnitActions from 'src/app/core/store/course/actions/unit.actions';
import { selectAllUnits, selectUnitLoading } from 'src/app/core/store/course/selectors/unit.selector';
import { Unit } from 'src/app/core/models/course/unit';

@Component({
    selector: 'app-unit-list',
    imports: [CommonModule, GlobalTable],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit {
    units$: Observable<Unit[]>;
    units: Unit[] = [];
    loading$: Observable<boolean>;
    loading = false;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['id', 'name', 'description', 'level.name', 'order', 'maximumAssessmentAttempt'];

    constructor(private router: Router, private store: Store) {
        this.units$ = this.store.select(selectAllUnits);
        this.loading$ = this.store.select(selectUnitLoading);
    }

    ngOnInit(): void {
        // Load units from store
        this.store.dispatch(UnitActions.loadUnits());

        // Subscribe to units and loading observables
        this.units$.subscribe(units => {
            this.units = units;
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });

        // Define columns for the table
        this.columns = [
            {
                field: 'id',
                header: 'ID',
                filterType: 'text',
            },
            {
                field: 'name',
                header: 'Nome',
                filterType: 'text',
            },
            {
                field: 'description',
                header: 'Descrição',
                filterType: 'text',
            },
            {
                field: 'level.name',
                header: 'Nível',
                filterType: 'text',
            },
            {
                field: 'order',
                header: 'Ordem',
                filterType: 'numeric',
            },
            {
                field: 'maximumAssessmentAttempt',
                header: 'Máximo de Tentativas',
                filterType: 'numeric',
            },
            {
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    viewDetails(unit: Unit): void {
        // Dispatch loadUnit action to load the selected unit
        this.store.dispatch(UnitActions.loadUnit({ id: unit.id }));
        this.router.navigate(['/courses/units', unit.id]);
    }

    createUnit(): void {
        // Navigate to create page
        this.router.navigate(['/courses/units/create']);
    }
}
