// student.component.ts
import { Component, OnInit, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as ServiceActions from 'src/app/core/store/corporate/services/service.actions';
import {selectSelectedService, selectServiceLoading} from 'src/app/core/store/corporate/services/service.selector';
import {SkeletonModule} from 'primeng/skeleton';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {Service, ServicePayload} from 'src/app/core/models/course/service';
import {toServiceRequestPayload} from 'src/app/core/constants/service-options';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DropdownModule} from 'primeng/dropdown';

@Component({
    selector: 'app-service-student',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule,
        DropdownModule,
        SkeletonModule,
        InputTextModule,
        ButtonModule,
        FormsModule,
        ProgressSpinnerModule]
})
export class DetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private store = inject(Store);


    serviceId: string = '';
    service$: Observable<Service | null>;
    service: Service | null = null;
    editableService: Service | null = null;
    loading$: Observable<boolean>;
    loading: boolean = true;

    constructor() {
        this.service$ = this.store.select(selectSelectedService);
        this.loading$ = this.store.select(selectServiceLoading);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.serviceId = params['id'];
            this.loadService();
        });

        this.service$.subscribe(service => {
            this.service = service;
            this.editableService = service ? {...service} : null;
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });
    }

    loadService(): void {
        this.store.dispatch(ServiceActions.loadService({id: this.serviceId}));
    }

    editService(): void {
        if (this.editableService) {
            const payload: ServicePayload = {
                name: this.editableService.name,
                description: this.editableService.description ?? '',
                value: this.editableService.value,
                active: this.editableService.active,
                category: this.editableService.category,
                type: this.editableService.type,
                code: this.editableService.code ?? '',
                providerName: this.editableService.providerName ?? '',
                hasStock: this.editableService.hasStock,
                minimumStock: this.editableService.minimumStock ?? 0,
                currentStock: this.editableService.currentStock ?? 0,
            };

            this.store.dispatch(ServiceActions.updateService({ id: this.serviceId, service: toServiceRequestPayload(payload) }));
        }
    }

    downloadServiceDetails(): void {
        console.log('Downloading service details:', this.service);
        alert('Download dos detalhes do Serviço iniciado');
    }

    sendServiceDetails(): void {
        console.log('Sending service details:', this.service?.name);
        alert('Detalhes do Serviço enviados para ' + this.service?.name);
    }
}
