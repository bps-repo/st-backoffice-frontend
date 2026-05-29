import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Service, ServicePayload } from 'src/app/core/models/course/service';
import {
    SERVICE_AUDIENCE_TYPE_OPTIONS,
    SERVICE_CATEGORY_OPTIONS,
    toServiceRequestPayload,
} from 'src/app/core/constants/service-options';
import { ServiceAudienceType } from 'src/app/core/enums/service-audience-type';
import { ServiceCategory } from 'src/app/core/enums/service-category';
import * as ServiceActions from 'src/app/core/store/corporate/services/service.actions';
import { selectServiceLoading } from 'src/app/core/store/corporate/services/service.selector';
import { ShowToastErrorService } from 'src/app/shared/services/show-toast-error-service';

@Component({
    selector: 'app-service-form-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        ToggleButtonModule,
        CheckboxModule,
        ToastModule,
    ],
    templateUrl: './service-form-dialog.component.html',
    providers: [MessageService],
})
export class ServiceFormDialogComponent implements OnInit {
    private store = inject(Store);
    private actions$ = inject(Actions);
    private messageService = inject(MessageService);

    visible = false;
    editMode = false;
    serviceId: string | null = null;

    form: ServicePayload = this.emptyForm();

    loading$: Observable<boolean> = this.store.select(selectServiceLoading);

    readonly categoryOptions = SERVICE_CATEGORY_OPTIONS;
    readonly typeOptions = SERVICE_AUDIENCE_TYPE_OPTIONS;

    ngOnInit(): void {}

    open(): void {
        this.editMode = false;
        this.serviceId = null;
        this.form = this.emptyForm();
        this.visible = true;
    }

    openForEdit(service: Service): void {
        this.editMode = true;
        this.serviceId = service.id;
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
        this.visible = true;
    }

    close(): void {
        this.visible = false;
    }

    onHasStockChange(): void {
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
        if (!this.form.category) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A categoria é obrigatória.' });
            return;
        }
        if (!this.form.type) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O tipo é obrigatório.' });
            return;
        }
        if (this.form.hasStock) {
            if (this.form.minimumStock == null || this.form.minimumStock < 0) {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O stock mínimo é obrigatório.' });
                return;
            }
            if (this.form.currentStock == null || this.form.currentStock < 0) {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O stock actual é obrigatório.' });
                return;
            }
        }

        const payload = toServiceRequestPayload(this.form);

        if (this.editMode && this.serviceId) {
            this.store.dispatch(
                ServiceActions.updateService({ id: this.serviceId, service: payload }),
            );

            this.actions$.pipe(ofType(ServiceActions.updateServiceSuccess), take(1)).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço actualizado com sucesso.' });
                this.close();
            });

            this.actions$.pipe(ofType(ServiceActions.updateServiceFailure), take(1)).subscribe(({ error }) => {
                ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Falha ao actualizar serviço.');
            });
        } else {
            this.store.dispatch(ServiceActions.createService({ service: payload }));

            this.actions$.pipe(ofType(ServiceActions.createServiceSuccess), take(1)).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço criado com sucesso.' });
                this.close();
            });

            this.actions$.pipe(ofType(ServiceActions.createServiceFailure), take(1)).subscribe(({ error }) => {
                ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Falha ao criar serviço.');
            });
        }
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
