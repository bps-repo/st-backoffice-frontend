import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, take, takeUntil } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Service, ServicePayload } from 'src/app/core/models/course/service';
import { ProductLevel } from 'src/app/core/models/course/product-level';
import {
    SERVICE_AUDIENCE_TYPE_OPTIONS,
    SERVICE_CATEGORY_OPTIONS,
    getServiceAudienceTypeLabel,
    getServiceCategoryLabel,
    toServiceRequestPayload,
} from 'src/app/core/constants/service-options';
import { ServiceAudienceType } from 'src/app/core/enums/service-audience-type';
import { ServiceCategory } from 'src/app/core/enums/service-category';
import { ServiceService } from 'src/app/core/services/service.service';
import * as ServiceActions from 'src/app/core/store/corporate/services/service.actions';
import { selectSelectedService, selectServiceError, selectServiceLoading } from 'src/app/core/store/corporate/services/service.selector';
import { ShowToastErrorService } from 'src/app/shared/services/show-toast-error-service';

@Component({
    selector: 'app-corporate-service-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        ToggleButtonModule,
        CheckboxModule,
        TagModule,
        ProgressSpinnerModule,
        ToastModule,
        TableModule,
        TooltipModule,
    ],
    templateUrl: './detail.component.html',
    providers: [MessageService],
})
export class DetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private store = inject(Store);
    private actions$ = inject(Actions);
    private messageService = inject(MessageService);
    private serviceApi = inject(ServiceService);
    private destroy$ = new Subject<void>();

    readonly ServiceCategory = ServiceCategory;
    readonly loading$ = this.store.select(selectServiceLoading).pipe(distinctUntilChanged());

    error: string | null = null;
    levelsError: string | null = null;
    serviceId: string | null = null;
    service: Service | null = null;
    form: ServicePayload = this.emptyForm();
    isDirty = false;

    levels: ProductLevel[] = [];
    levelsLoading = false;

    readonly categoryOptions = SERVICE_CATEGORY_OPTIONS;
    readonly typeOptions = SERVICE_AUDIENCE_TYPE_OPTIONS;

    ngOnInit(): void {
        this.store.select(selectServiceError).pipe(takeUntil(this.destroy$)).subscribe((e) => {
            this.error = e;
        });

        this.store.select(selectSelectedService).pipe(takeUntil(this.destroy$)).subscribe((service) => {
            if (service) {
                this.service = service;
                this.form = {
                    name: service.name,
                    description: service.description,
                    value: service.value,
                    active: service.active,
                    category: service.category,
                    type: service.type,
                    code: service.code ?? '',
                    providerName: service.providerName ?? '',
                    hasStock: service.hasStock,
                    minimumStock: service.minimumStock ?? 0,
                    currentStock: service.currentStock ?? 0,
                };
                this.isDirty = false;
                this.loadLevelsIfLanguageCourse();
            }
        });

        this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            this.serviceId = params['id'];
            if (this.serviceId) {
                this.store.dispatch(ServiceActions.loadService({ id: this.serviceId }));
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get isLanguageCourse(): boolean {
        return this.service?.category === ServiceCategory.LANGUAGE_COURSE;
    }

    markDirty(): void {
        this.isDirty = true;
    }

    onHasStockChange(): void {
        this.markDirty();
        if (!this.form.hasStock) {
            this.form.minimumStock = 0;
            this.form.currentStock = 0;
        }
    }

    save(): void {
        if (!this.form.name?.trim()) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome é obrigatório.' });
            return;
        }
        if (!this.serviceId) return;

        const payload = toServiceRequestPayload(this.form);

        this.store.dispatch(ServiceActions.updateService({ id: this.serviceId, service: payload }));

        this.actions$.pipe(ofType(ServiceActions.updateServiceSuccess), take(1)).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Serviço actualizado com sucesso.' });
            this.isDirty = false;
        });

        this.actions$.pipe(ofType(ServiceActions.updateServiceFailure), take(1)).subscribe(({ error }) => {
            ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Falha ao actualizar serviço.');
        });
    }

    goBack(): void {
        this.router.navigate(['/corporate/services']);
    }

    getCategoryLabel(category: string): string {
        return getServiceCategoryLabel(category);
    }

    getTypeLabel(type: string): string {
        return getServiceAudienceTypeLabel(type);
    }

    private loadLevelsIfLanguageCourse(): void {
        if (!this.serviceId || !this.isLanguageCourse) {
            this.levels = [];
            this.levelsError = null;
            this.levelsLoading = false;
            return;
        }

        this.levelsLoading = true;
        this.levelsError = null;

        this.serviceApi.getServiceLevels(this.serviceId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (levels) => {
                this.levels = [...levels].sort((a, b) => a.order - b.order);
                this.levelsLoading = false;
            },
            error: (err) => {
                this.levels = [];
                this.levelsLoading = false;
                this.levelsError = err?.error?.message ?? 'Falha ao carregar os níveis do curso.';
            },
        });
    }

    private emptyForm(): ServicePayload {
        return {
            name: '',
            description: '',
            value: 0,
            active: true,
            category: ServiceCategory.GENERAL,
            type: ServiceAudienceType.ADULTS,
            code: '',
            providerName: '',
            hasStock: false,
            minimumStock: 0,
            currentStock: 0,
        };
    }
}
