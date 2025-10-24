import { createAction, props } from '@ngrx/store';
import { Service } from 'src/app/core/models/course/service';

export const loadServices = createAction('[Service] Load Services');

export const createService = createAction(
    '[Service] Create Service',
    props<{ service: Service }>()
);

export const createServiceSuccess = createAction(
    '[Service] Create Service Success',
    props<{ service: Service }>()
);

export const createServiceFailure = createAction(
    '[Service] Create Service Failure',
    props<{ error: any }>()
);

export const loadServicesSuccess = createAction(
    '[Service] Load Services Success',
    props<{ services: Service[] }>()
);

export const loadServicesFailure = createAction(
    '[Service] Load Services Failure',
    props<{ error: any }>()
);

export const loadService = createAction(
    '[Service] Load Service',
    props<{ id: string }>()
);

export const loadServiceSuccess = createAction(
    '[Service] Load Service Success',
    props<{ service: Service }>()
);

export const loadServiceFailure = createAction(
    '[Service] Load Service Failure',
    props<{ error: any }>()
);

export const loadPagedServices = createAction(
    '[Service] Load Paged Services',
    props<{ size: number }>()
);

export const loadPagedServicesSuccess = createAction(
    '[Service] Load Paged Services Success',
    props<{ services: Service[] }>()
);

export const loadPagedServicesFailure = createAction(
    '[Service] Load Paged Services Failure',
    props<{ error: any }>()
);

export const deleteService = createAction(
    '[Service] Delete Service',
    props<{ id: string }>()
);

export const deleteServiceSuccess = createAction(
    '[Service] Delete Service Success',
    props<{ id: string }>()
);

export const deleteServiceFailure = createAction(
    '[Service] Delete Service Failure',
    props<{ error: any }>()
);

export const updateService = createAction(
    '[Service] Update Service',
    props<{ id: string; service: Service }>()
);

export const updateServiceSuccess = createAction(
    '[Service] Update Service Success',
    props<{ service: Service }>()
);

export const updateServiceFailure = createAction(
    '[Service] Update Service Failure',
    props<{ error: any }>()
);

