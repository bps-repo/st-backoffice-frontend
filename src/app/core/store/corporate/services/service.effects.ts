import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ServiceActions from '../actions/service.actions';
import { ServiceService } from 'src/app/core/services/service.service';
import { ApiResponse } from 'src/app/core/services/interfaces/ApiResponseService';
import { Service } from 'src/app/core/models/course/service';

@Injectable()
export class ServiceEffects {
    constructor(private actions$: Actions, private serviceService: ServiceService) {}

    createService$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ServiceActions.createService),
            mergeMap(({ service }) =>
                this.serviceService.createService(service).pipe(
                    map((response: ApiResponse<Service>) =>
                        ServiceActions.createServiceSuccess({ service: response.data })
                    ),
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
                    map((response: ApiResponse<Service>) =>
                        ServiceActions.loadServiceSuccess({ service: response.data })
                    ),
                    catchError(error =>
                        of(ServiceActions.loadServiceFailure({ error }))
                    )
                )
            )
        )
    );

    // loadPagedServices$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(ServiceActions.loadPagedServices),
    //         mergeMap(({ size }) =>
    //             this.serviceService.getPagedServices(size).pipe(
    //                 map((response: ApiResponse<{ content: Service[] }>) =>
    //                     ServiceActions.loadPagedServicesSuccess({ services: response.data.content })
    //                 ),
    //                 catchError(error =>
    //                     of(ServiceActions.loadPagedServicesFailure({ error }))
    //                 )
    //             )
    //         )
    //     )
    // );

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
                    map((response: ApiResponse<Service>) =>
                        ServiceActions.updateServiceSuccess({ service: response.data })
                    ),
                    catchError(error =>
                        of(ServiceActions.updateServiceFailure({ error }))
                    )
                )
            )
        )
    );


}
