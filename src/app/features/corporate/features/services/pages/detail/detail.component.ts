import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Service } from 'src/app/core/models/course/service';
import * as ServiceActions from 'src/app/core/store/corporate/services/service.actions';
import { selectSelectedService, selectServiceError, selectServiceLoading } from 'src/app/core/store/corporate/services/service.selector';

@Component({
    selector: 'app-corporate-service-detail',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, TagModule, ProgressSpinnerModule],
    templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private readonly store = inject(Store);
    private destroy$ = new Subject<void>();

    /** NgRx — `selectServiceLoading`. */
    readonly loading$ = this.store.select(selectServiceLoading).pipe(distinctUntilChanged());

    error: string | null = null;
    serviceId: string | null = null;
    service: Service | null = null;

    ngOnInit(): void {
        this.store.select(selectServiceError).pipe(takeUntil(this.destroy$)).subscribe((error) => {
            this.error = error;
        });

        this.store.select(selectSelectedService).pipe(takeUntil(this.destroy$)).subscribe((service) => {
            this.service = service;
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

    goBack(): void {
        this.router.navigate(['/corporate/services']);
    }
}
