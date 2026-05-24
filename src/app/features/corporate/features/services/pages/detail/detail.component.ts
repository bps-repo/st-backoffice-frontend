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
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { Service, ServicePayload, ServiceType } from 'src/app/core/models/course/service';
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
        TagModule,
        ProgressSpinnerModule,
        ToastModule,
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
    private destroy$ = new Subject<void>();

    readonly loading$ = this.store.select(selectServiceLoading).pipe(distinctUntilChanged());

    error: string | null = null;
    serviceId: string | null = null;
    service: Service | null = null;
    form: ServicePayload = { name: '', description: '', value: 0, active: true, type: 'GENERAL' };
    isDirty = false;

    readonly typeOptions: { label: string; value: ServiceType }[] = [
        { label: 'Geral', value: 'GENERAL' },
        { label: 'Curso Inglês Adulto', value: 'ADULT_ENGLISH_COURSE' },
        { label: 'Curso Inglês Kids', value: 'KIDS_ENGLISH_COURSE' },
        { label: 'ATL', value: 'ATL' },
    ];

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
                    type: service.type,
                };
                this.isDirty = false;
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

    markDirty(): void {
        this.isDirty = true;
    }

    save(): void {
        if (!this.form.name?.trim()) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome é obrigatório.' });
            return;
        }
        if (!this.serviceId) return;

        this.store.dispatch(ServiceActions.updateService({ id: this.serviceId, service: { ...this.form } as Service }));

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

    getTypeLabel(type: string): string {
        const found = this.typeOptions.find((o) => o.value === type);
        return found ? found.label : type || '-';
    }
}
