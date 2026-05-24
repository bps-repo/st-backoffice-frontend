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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Service, ServicePayload, ServiceType } from 'src/app/core/models/course/service';
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

    readonly typeOptions: { label: string; value: ServiceType }[] = [
        { label: 'Geral', value: 'GENERAL' },
        { label: 'Curso Inglês Adulto', value: 'ADULT_ENGLISH_COURSE' },
        { label: 'Curso Inglês Kids', value: 'KIDS_ENGLISH_COURSE' },
        { label: 'ATL', value: 'ATL' },
    ];

    ngOnInit(): void {}

    /** Open in create mode */
    open(): void {
        this.editMode = false;
        this.serviceId = null;
        this.form = this.emptyForm();
        this.visible = true;
    }

    /** Open in edit mode pre-filled with existing data */
    openForEdit(service: Service): void {
        this.editMode = true;
        this.serviceId = service.id;
        this.form = {
            name: service.name,
            description: service.description,
            value: service.value,
            active: service.active,
            type: service.type,
        };
        this.visible = true;
    }

    close(): void {
        this.visible = false;
    }

    save(): void {
        if (!this.form.name?.trim()) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome é obrigatório.' });
            return;
        }
        if (!this.form.type) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O tipo é obrigatório.' });
            return;
        }

        if (this.editMode && this.serviceId) {
            this.store.dispatch(
                ServiceActions.updateService({ id: this.serviceId, service: { ...this.form } as Service }),
            );

            this.actions$.pipe(ofType(ServiceActions.updateServiceSuccess), take(1)).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço actualizado com sucesso.' });
                this.close();
            });

            this.actions$.pipe(ofType(ServiceActions.updateServiceFailure), take(1)).subscribe(({ error }) => {
                ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Falha ao actualizar serviço.');
            });
        } else {
            this.store.dispatch(ServiceActions.createService({ service: { ...this.form } as Service }));

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
        return { name: '', description: '', value: 0, active: true, type: 'GENERAL' };
    }
}
