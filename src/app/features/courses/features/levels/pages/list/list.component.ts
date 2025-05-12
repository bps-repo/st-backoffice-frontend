import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, startWith } from 'rxjs';
import { CreateLevelDialogComponent } from '../../dialogs/create-level-dialog/create-level-dialog.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableColumn, GlobalTable } from 'src/app/shared/components/tables/global-table/global-table.component';
import * as LevelActions from 'src/app/core/store/course/actions/level.actions';
import { selectAllLevels, selectLevelLoading } from 'src/app/core/store/course/selectors/level.selector';
import { Level } from 'src/app/core/models/course/level';

@Component({
    selector: 'app-level-list',
    imports: [CommonModule, GlobalTable, ConfirmDialogModule, ButtonModule, CreateLevelDialogComponent],
    templateUrl: './list.component.html',
    standalone: true,
    providers: [ConfirmationService]
})
export class ListComponent implements OnInit {

    @ViewChild(CreateLevelDialogComponent) createLevelDialog!: CreateLevelDialogComponent;

    levels$: Observable<Level[]>;
    levels: Level[] = [];
    loading$: Observable<boolean>;
    loading = false;

    columns: TableColumn[] = [];
    size = 10;

    constructor(private router: Router,
        private store: Store,
        private confirmationService: ConfirmationService) {

        this.levels$ = this.store.select(selectAllLevels).pipe(
                                startWith([])
                            );
                    this.loading$ = this.store.select(selectLevelLoading);
    }

    ngOnInit(): void {

        this.loadLevels();

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
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    loadLevels(): void {
        this.store.dispatch(LevelActions.loadPagedLevels({ size: this.size }));
    }


    viewDetails(level: Level): void {
        this.router.navigate(['/courses/levels', level.id]);
    }

    createLevel(): void {
        this.createLevelDialog.show();
    }

    deleteLevel(level: Level): void {
            this.confirmationService.confirm({
                message: `Tem certeza de que deseja excluir o nivel "${level.name}"?`,
                header: 'Confirmação',
                icon: 'pi pi-exclamation-triangle text-warning',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-secondary',
                accept: () => {
                    this.store.dispatch(LevelActions.deleteLevel({ id: level.id }));
                },
                reject: () => {
                    console.log('Ação de exclusão cancelada.');
                }
            });
        }
}
