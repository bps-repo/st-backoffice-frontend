import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
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
import { selectServiceError, selectServiceLoading } from 'src/app/core/store/corporate/services/service.selector';
import { ServiceState } from '../../../../../../core/store/corporate/services/services.state';
import { ShowToastErrorService } from 'src/app/shared/services/show-toast-error-service';

@Component({
    selector: 'app-create-service-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        SelectModule,
        InputTextModule,
        InputNumberModule,
        CheckboxModule,
        ToggleButtonModule,
        ToastModule,
    ],
    templateUrl: './create-service-dialog.component.html',
    providers: [MessageService],
})
export class CreateServiceDialogComponent implements OnInit {
    private store = inject<Store<ServiceState>>(Store);
    private actions$ = inject(Actions);
    private messageService = inject(MessageService);

    visible = false;

    form: ServicePayload = this.emptyForm();

    readonly categoryOptions = SERVICE_CATEGORY_OPTIONS;
    readonly typeOptions = SERVICE_AUDIENCE_TYPE_OPTIONS;

    loading$: Observable<boolean> = this.store.select(selectServiceLoading);
    error$: Observable<string | null> = this.store.select(selectServiceError);

    ngOnInit(): void {}

    show(): void {
        this.form = this.emptyForm();
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
    }

    onHasStockChange(): void {
        if (!this.form.hasStock) {
            this.form.minimumStock = 0;
            this.form.currentStock = 0;
        }
    }

    saveService(): void {
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

        const payload = toServiceRequestPayload(this.form);

        this.store.dispatch(ServiceActions.createService({ service: payload }));

        this.actions$.pipe(ofType(ServiceActions.createServiceSuccess), take(1)).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço criado com sucesso.' });
            this.hide();
            this.resetForm();
        });

        this.actions$.pipe(ofType(ServiceActions.createServiceFailure), take(1)).subscribe(({ error }) => {
            ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Falha ao criar serviço.');
        });
    }

    resetForm(): void {
        this.form = this.emptyForm();
    }

    private emptyForm(): ServicePayload {
        return {
            name: '',
            description: '',
            value: 0,
            active: true,
            category: ServiceCategory.LANGUAGE_COURSE,
            type: ServiceAudienceType.ADULTS,
            code: '',
            providerName: '',
            hasStock: false,
            minimumStock: 0,
            currentStock: 0,
        };
    }
}
