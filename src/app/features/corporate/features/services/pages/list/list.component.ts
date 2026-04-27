import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TableLazyLoadEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Service } from 'src/app/core/models/course/service';
import * as ServiceActions from 'src/app/core/store/corporate/services/service.actions';
import {
    selectAllServices,
    selectServiceError,
    selectServiceLoading,
    selectServicesTotalElements,
} from 'src/app/core/store/corporate/services/service.selector';

@Component({
    selector: 'app-corporate-services-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TableModule, TagModule, ProgressSpinnerModule],
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    private router = inject(Router);
    private store = inject(Store);

    services$: Observable<Service[]> = this.store.select(selectAllServices);
    loading$: Observable<boolean> = this.store.select(selectServiceLoading);
    error$: Observable<string | null> = this.store.select(selectServiceError);
    totalElements$: Observable<number> = this.store.select(selectServicesTotalElements);

    searchTerm = '';
    typeFilter = '';
    statusFilter: '' | 'active' | 'inactive' = '';
    rows = 15;
    page = 0;

    filteredServices$: Observable<Service[]> = this.services$.pipe(
        map((services) =>
            services.filter((service) => {
                console.log("service",service);
                const search = this.searchTerm.trim().toLowerCase();
                const matchesSearch = !search
                    || service.name?.toLowerCase().includes(search)
                    || service.description?.toLowerCase().includes(search);
                const matchesType = !this.typeFilter || service.type === this.typeFilter;
                const matchesStatus =
                    !this.statusFilter
                    || (this.statusFilter === 'active' && service.active)
                    || (this.statusFilter === 'inactive' && !service.active);

                return matchesSearch && matchesType && matchesStatus;
            }),
        ),
    );

    ngOnInit(): void {
        this.store.dispatch(ServiceActions.loadServicesPaged({ page: this.page, size: this.rows }));
    }

    getTypeLabel(type: string): string {
        switch (type) {
            case 'ADULT_ENGLISH_COURSE':
                return 'Curso Inglês Adulto';
            case 'KIDS_ENGLISH_COURSE':
                return 'Curso Inglês Kids';
            case 'GENERAL':
                return 'Geral';
            default:
                return type || '-';
        }
    }

    getStatusSeverity(active: boolean): 'success' | 'danger' {
        return active ? 'success' : 'danger';
    }

    getServiceTypes(services: Service[] | null): string[] {
        if (!services || services.length === 0) {
            return [];
        }
        return [...new Set(services.map((service) => service.type).filter(Boolean))];
    }

    onFilterChange(): void {
        this.filteredServices$ = this.services$.pipe(
            map((services) =>
                services.filter((service) => {
                    console.log("services",service);
                    const search = this.searchTerm.trim().toLowerCase();
                    const matchesSearch = !search
                        || service.name?.toLowerCase().includes(search)
                        || service.description?.toLowerCase().includes(search);
                    const matchesType = !this.typeFilter || service.type === this.typeFilter;
                    const matchesStatus =
                        !this.statusFilter
                        || (this.statusFilter === 'active' && service.active)
                        || (this.statusFilter === 'inactive' && !service.active);

                    return matchesSearch && matchesType && matchesStatus;
                }),
            ),
        );
    }

    onLazyLoad(event: TableLazyLoadEvent): void {
        const first = event.first || 0;
        const rows = event.rows || this.rows;
        this.rows = rows;
        this.page = Math.floor(first / rows);
        this.store.dispatch(ServiceActions.loadServicesPaged({ page: this.page, size: this.rows }));
    }

    viewDetails(service: Service): void {
        this.router.navigate(['/corporate/services', service.id]);
    }
}
