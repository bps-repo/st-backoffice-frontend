import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';
import { Service } from 'src/app/core/models/course/service';
import {
    SERVICE_AUDIENCE_TYPE_OPTIONS,
    SERVICE_CATEGORY_OPTIONS,
    getServiceAudienceTypeLabel,
    getServiceCategoryLabel,
} from 'src/app/core/constants/service-options';
import * as ServiceActions from 'src/app/core/store/corporate/services/service.actions';
import {
    selectAllServices,
    selectServiceError,
    selectServiceLoading,
    selectServicesTotalElements,
} from 'src/app/core/store/corporate/services/service.selector';
import { ServiceFormDialogComponent } from '../../dialogs/service-form-dialog/service-form-dialog.component';
import { ShowToastErrorService } from 'src/app/shared/services/show-toast-error-service';

@Component({
    selector: 'app-corporate-services-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        TagModule,
        ProgressSpinnerModule,
        SelectModule,
        TooltipModule,
        ConfirmDialogModule,
        ToastModule,
        ServiceFormDialogComponent,
    ],
    templateUrl: './list.component.html',
    providers: [ConfirmationService, MessageService],
})
export class ListComponent implements OnInit {
    @ViewChild('formDialog') formDialog!: ServiceFormDialogComponent;

    private store = inject(Store);
    private router = inject(Router);
    private actions$ = inject(Actions);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    services$: Observable<Service[]> = this.store.select(selectAllServices);
    loading$: Observable<boolean> = this.store.select(selectServiceLoading);
    error$: Observable<string | null> = this.store.select(selectServiceError);
    totalElements$: Observable<number> = this.store.select(selectServicesTotalElements);

    searchTerm = '';
    categoryFilter = '';
    typeFilter = '';
    statusFilter: '' | 'active' | 'inactive' = '';
    rows = 15;
    page = 0;

    readonly categoryOptions = [{ label: 'Todas as categorias', value: '' }, ...SERVICE_CATEGORY_OPTIONS];
    readonly typeOptions = [{ label: 'Todos os tipos', value: '' }, ...SERVICE_AUDIENCE_TYPE_OPTIONS];

    readonly statusOptions = [
        { label: 'Todos os estados', value: '' },
        { label: 'Activo', value: 'active' },
        { label: 'Inactivo', value: 'inactive' },
    ];

    filteredServices$: Observable<Service[]> = this.buildFilter();

    ngOnInit(): void {
        this.store.dispatch(ServiceActions.loadServicesPaged({ page: this.page, size: this.rows }));
    }

    getCategoryLabel(category: string): string {
        return getServiceCategoryLabel(category);
    }

    getTypeLabel(type: string): string {
        return getServiceAudienceTypeLabel(type);
    }

    getStatusSeverity(active: boolean): 'success' | 'danger' {
        return active ? 'success' : 'danger';
    }

    onFilterChange(): void {
        this.filteredServices$ = this.buildFilter();
    }

    onLazyLoad(event: TableLazyLoadEvent): void {
        const first = event.first ?? 0;
        const rows = event.rows ?? this.rows;
        this.rows = rows;
        this.page = Math.floor(first / rows);
        this.store.dispatch(ServiceActions.loadServicesPaged({ page: this.page, size: this.rows }));
    }

    openCreate(): void {
        this.formDialog.open();
    }

    openDetail(service: Service): void {
        this.router.navigate(['/corporate/services', service.id]);
    }

    openEdit(service: Service): void {
        this.formDialog.openForEdit(service);
    }

    confirmDelete(service: Service): void {
        this.confirmationService.confirm({
            message: `Tem a certeza que deseja eliminar o serviço "<strong>${service.name}</strong>"?`,
            header: 'Confirmar eliminação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.store.dispatch(ServiceActions.deleteService({ id: service.id }));

                this.actions$.pipe(ofType(ServiceActions.deleteServiceSuccess), take(1)).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Serviço eliminado com sucesso.' });
                    this.store.dispatch(ServiceActions.loadServicesPaged({ page: this.page, size: this.rows }));
                });

                this.actions$.pipe(ofType(ServiceActions.deleteServiceFailure), take(1)).subscribe(({ error }) => {
                    ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Falha ao eliminar serviço.');
                });
            },
        });
    }

    private buildFilter(): Observable<Service[]> {
        return this.services$.pipe(
            map((services) =>
                services.filter((s) => {
                    const search = this.searchTerm.trim().toLowerCase();
                    const matchSearch = !search || s.name?.toLowerCase().includes(search) || s.description?.toLowerCase().includes(search);
                    const matchCategory = !this.categoryFilter || s.category === this.categoryFilter;
                    const matchType = !this.typeFilter || s.type === this.typeFilter;
                    const matchStatus =
                        !this.statusFilter
                        || (this.statusFilter === 'active' && s.active)
                        || (this.statusFilter === 'inactive' && !s.active);
                    return matchSearch && matchCategory && matchType && matchStatus;
                }),
            ),
        );
    }
}
