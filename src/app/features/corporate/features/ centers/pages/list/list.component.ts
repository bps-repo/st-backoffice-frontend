import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { map, startWith } from 'rxjs/operators';
import { TableColumn, GlobalTable } from 'src/app/shared/components/tables/global-table/global-table.component';
import { Center } from 'src/app/core/models/corporate/center';
import { CreateCenterDialogComponent } from '../../dialogs/create-center-dialog/create-center-dialog.component';
import * as CenterActions from 'src/app/core/store/corporate/actions/center.actions';
import { selectAllCenters, selectCenterLoading } from 'src/app/core/store/corporate/selectors/center.selector';

@Component({
    selector: 'app-center-list',
    imports: [CommonModule, GlobalTable, CreateCenterDialogComponent, ButtonModule, ConfirmDialogModule],
    templateUrl: './list.component.html',
    standalone: true,
    providers: [ConfirmationService]
})
export class ListComponent implements OnInit {
    @ViewChild(CreateCenterDialogComponent) createCenterDialog!: CreateCenterDialogComponent;

    centers$: Observable<Center[]>;
    loading$: Observable<boolean>;

    columns: TableColumn[] = [];
    size = 10; // Tamanho da página

    constructor(
        private router: Router,
        private store: Store,
        private confirmationService: ConfirmationService
    ) {
        this.centers$ = this.store.select(selectAllCenters).pipe(
            startWith([]) // Garante que o Observable sempre tenha um valor inicial
        );
        this.loading$ = this.store.select(selectCenterLoading);
    }

    ngOnInit(): void {
        this.loadCenters();

        // Define as colunas da tabela
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
                field: 'address',
                header: 'Endereço',
                filterType: 'text',
            },
            {
                field: 'phone',
                header: 'Telefone',
                filterType: 'text',
            },
            {
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    loadCenters(): void {
        this.store.dispatch(CenterActions.loadPagedCenters({ size: this.size }));
    }

    viewDetails(center: Center): void {
        this.router.navigate(['/corporate/centers', center.id]);
    }

    createCenter(): void {
        this.createCenterDialog.show();
    }

    deleteCenter(center: Center): void {
        this.confirmationService.confirm({
            message: `Tem certeza de que deseja excluir o centro "${center.name}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle text-warning',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.store.dispatch(CenterActions.deleteCenter({ id: center.id }));
            },
            reject: () => {
                console.log('Ação de exclusão cancelada.');
            }
        });
    }
}
