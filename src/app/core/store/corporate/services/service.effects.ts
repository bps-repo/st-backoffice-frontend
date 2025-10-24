import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ServiceActions from './service.actions';
import { ServiceService } from 'src/app/core/services/service.service';
import { ApiResponse, PageableResponse } from 'src/app/core/models/ApiResponseService';
import { Service } from 'src/app/core/models/course/service';
import { Product } from 'src/app/core/models/corporate/product';

@Injectable()
export class ServiceEffects {
    constructor(private actions$: Actions, private serviceService: ServiceService) {
    }

    loadServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ServiceActions.loadServices),
            mergeMap(() =>
                this.serviceService.getServices().pipe(
                    map((services) => ServiceActions.loadServicesSuccess({ services })),
                    catchError(error =>
                        of(ServiceActions.loadServicesFailure({ error }))
                    )
                )
            )
        )
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
