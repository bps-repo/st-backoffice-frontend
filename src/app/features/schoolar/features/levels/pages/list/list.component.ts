import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, startWith} from 'rxjs';
import {CreateLevelDialogComponent} from '../../dialogs/create-level-dialog/create-level-dialog.component';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableColumn, GlobalTable} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Level} from 'src/app/core/models/course/level';
import {RippleModule} from "primeng/ripple";
import {DockModule} from "primeng/dock";
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import {LEVEL_COLUMNS} from "../../level.const";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
    selector: 'app-level-general',
    imports: [CommonModule, GlobalTable, ConfirmDialogModule, ButtonModule, CreateLevelDialogComponent, RippleModule, DockModule, ProgressSpinnerModule],
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

    columns: TableColumn[] = LEVEL_COLUMNS;
    size = 10;
    error$: Observable<any> = this.store.select(LevelSelectors.selectError);

    constructor(private router: Router,
                private store: Store,
                private confirmationService: ConfirmationService) {

        this.levels$ = this.store.select(LevelSelectors.selectAllLevels)
        this.loading$ = this.store.select(LevelSelectors.selectLevelsLoading);
    }

    ngOnInit(): void {
        this.store.dispatch(LevelActions.loadLevels());
    }

    viewDetails(level: Level): void {
        this.router.navigate(['/courses/levels', level.id]).then();
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
                this.store.dispatch(LevelActions.deleteLevel({id: level.id}));
            },
            reject: () => {
                console.log('Ação de exclusão cancelada.');
            }
        });
    }
}
