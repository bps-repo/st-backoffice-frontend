import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import * as LevelActions from 'src/app/core/store/course/actions/level.actions';
import { selectAllLevels, selectLevelLoading } from 'src/app/core/store/course/selectors/level.selector';
import { Level } from 'src/app/core/models/course/level';

@Component({
    selector: 'app-level-list',
    imports: [CommonModule, GlobalTable],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit {
    levels$: Observable<Level[]>;
    levels: Level[] = [];
    loading$: Observable<boolean>;
    loading = false;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['id', 'name', 'description', 'duration', 'maximumUnits', 'course.name'];

    constructor(private router: Router, private store: Store) {
        this.levels$ = this.store.select(selectAllLevels);
        this.loading$ = this.store.select(selectLevelLoading);
    }

    ngOnInit(): void {
        // Load levels from store
        this.store.dispatch(LevelActions.loadLevels());

        // Subscribe to levels and loading observables
        this.levels$.subscribe(levels => {
            this.levels = levels;
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
                field: 'duration',
                header: 'Duração',
                filterType: 'numeric',
            },
            {
                field: 'maximumUnits',
                header: 'Unidades Máximas',
                filterType: 'numeric',
            },
            {
                field: 'course.name',
                header: 'Curso',
                filterType: 'text',
            },
            {
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    viewDetails(level: Level): void {
        // Dispatch loadLevel action to load the selected level
        this.store.dispatch(LevelActions.loadLevel({ id: level.id }));
        this.router.navigate(['/courses/levels', level.id]);
    }

    createLevel(): void {
        // Navigate to create page
        this.router.navigate(['/courses/levels/create']);
    }
}