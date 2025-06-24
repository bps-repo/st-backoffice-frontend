// student.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ServiceActions from 'src/app/core/store/course/actions/service.actions';
import { selectSelectedService, selectServiceLoading } from 'src/app/core/store/course/selectors/service.selector';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Service } from 'src/app/core/models/course/service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-service-student',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule,
        DropdownModule ,
        SkeletonModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        FormsModule,
        ProgressSpinnerModule]
})
export class DetailComponent implements OnInit {

    serviceId: string = '';
    service$: Observable<Service | null>;
    service: Service | null = null;
    editableService: Service | null = null;
    loading$: Observable<boolean>;
    loading: boolean = true;

    constructor(private route: ActivatedRoute, private store: Store) {
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
            this.editableService = service ? { ...service } : null;
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });
    }

    loadService(): void {
        this.store.dispatch(ServiceActions.loadService({ id: this.serviceId }));
    }

    editService(): void {
        if (this.editableService) {
            const updatedService: Partial<Service> = {
                name: this.editableService.name,
                description: this.editableService.description,
                value: this.editableService.value,
                type: this.editableService.type,
                active: this.editableService.active
            };

            this.store.dispatch(ServiceActions.updateService({ id: this.serviceId, service: updatedService }));
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
