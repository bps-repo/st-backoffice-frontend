import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, startWith } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import { ButtonModule } from 'primeng/button';
import * as ServiceActions from 'src/app/core/store/course/actions/service.actions';
import { selectAllServices, selectServiceLoading } from 'src/app/core/store/course/selectors/service.selector';
import { Service } from 'src/app/core/models/course/service';
import { CreateServiceDialogComponent } from '../../dialogs/create-service-dialog/create-service-dialog.component';

@Component({
    selector: 'app-service-general',
    imports: [CommonModule, GlobalTable, CreateServiceDialogComponent, ConfirmDialogModule, ButtonModule],
    templateUrl: './list.component.html',
    standalone: true,
    providers: [ConfirmationService]

})
export class ListComponent implements OnInit {

    @ViewChild(CreateServiceDialogComponent) createServiceDialog!: CreateServiceDialogComponent;

    services$: Observable<Service[]>;
    loading$: Observable<boolean>;

    columns: TableColumn[] = [];
    size = 10;

    constructor(private router: Router,
        private store: Store,
        private confirmationService: ConfirmationService) {

            this.services$ = this.store.select(selectAllServices).pipe(
                        startWith([])
                    );
            this.loading$ = this.store.select(selectServiceLoading);
    }

    ngOnInit(): void {
        this.loadServices();

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
                field: 'value',
                header: 'Valor',
                filterType: 'text',
            },
            {
                field: 'type',
                header: 'Tipo',
                filterType: 'text',
            },
            {
                field: 'active',
                header: 'Ativo',
                filterType: 'boolean',
            },
            {
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    loadServices(): void {
            this.store.dispatch(ServiceActions.loadPagedServices({ size: this.size }));
        }

    viewDetails(service: Service): void {
        this.router.navigate(['/courses/courses', service.id]);
    }

    createService(): void {
        this.createServiceDialog.show();
    }

    deleteService(service: Service): void {
        this.confirmationService.confirm({
            message: `Tem certeza de que deseja excluir o serviço "${service.name}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle text-warning',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.store.dispatch(ServiceActions.deleteService({ id: service.id }));
            },
            reject: () => {
                console.log('Ação de exclusão cancelada.');
            }
        });
    }
}
