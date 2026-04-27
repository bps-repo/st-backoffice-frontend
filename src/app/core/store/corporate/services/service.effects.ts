import { Injectable, inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ServiceActions from './service.actions';
import { ServiceService } from 'src/app/core/services/service.service';
import { Service } from 'src/app/core/models/course/service';

@Injectable()
export class ServiceEffects {
    private actions$ = inject(Actions);
    private serviceService = inject(ServiceService);


    loadServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ServiceActions.loadServices),
            mergeMap(() =>
                this.serviceService.getServices(0, 15).pipe(
                    map((response) => ServiceActions.loadServicesSuccess({
                        services: response.data.content as Service[],
                        page: response.data.number,
                        size: response.data.size,
                        totalElements: response.data.totalElements,
                        totalPages: response.data.totalPages,
                    })),
                    catchError(error =>
                        of(ServiceActions.loadServicesFailure({ error }))
                    )
                )
            )
        )
    );

    loadServicesPaged$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ServiceActions.loadServicesPaged),
            mergeMap(({ page, size, sort }) =>
                this.serviceService.getServices(page, size, sort).pipe(
                    map((response) => ServiceActions.loadServicesSuccess({
                        services: response.data.content as Service[],
                        page: response.data.number,
                        size: response.data.size,
                        totalElements: response.data.totalElements,
                        totalPages: response.data.totalPages,
                    })),
                    catchError((error) => of(ServiceActions.loadServicesFailure({ error }))),
                ),
            ),
        ),
    );

    createService$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ServiceActions.createService),
            mergeMap(({ service }) =>
                this.serviceService.createService(service).pipe(
                    map((service) => ServiceActions.createServiceSuccess({ service })),
                    catchError(error =>
                        of(ServiceActions.createServiceFailure({ error }))
                    )
                )
            )
        )
    );

    loadService$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ServiceActions.loadService),
            mergeMap(({ id }) =>
                this.serviceService.getServiceById(id).pipe(
                    map((service) => ServiceActions.loadServiceSuccess({ service })),
                    catchError(error =>
                        of(ServiceActions.loadServiceFailure({ error }))
                    )
                )
            )
        )
    );

    deleteService$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ServiceActions.deleteService),
            mergeMap(({ id }) =>
                this.serviceService.deleteService(id).pipe(
                    map(() => ServiceActions.deleteServiceSuccess({ id })),
                    catchError(error =>
                        of(ServiceActions.deleteServiceFailure({ error }))
                    )
                )
            )
        )
    );

    updateService$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ServiceActions.updateService),
            mergeMap(({ id, service }) =>
                this.serviceService.updateService(id, service).pipe(
                    map((service) => ServiceActions.updateServiceSuccess({ service })),
                    catchError(error =>
                        of(ServiceActions.updateServiceFailure({ error }))
                    )
                )
            )
        )
    );


}
