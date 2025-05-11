import { createAction, props } from '@ngrx/store';
import { Center } from 'src/app/core/models/corporate/center';

// Ação para criar um Center
export const createCenter = createAction(
    '[Center] Create Center',
    props<{ center: Partial<Center> }>()
);

// Ação para sucesso na criação de um Center
export const createCenterSuccess = createAction(
    '[Center] Create Center Success',
    props<{ center: Center }>()
);

// Ação para falha na criação de um Center
export const createCenterFailure = createAction(
    '[Center] Create Center Failure',
    props<{ error: any }>()
);

export const loadCenters = createAction('[Center] Load Centers');

export const loadCentersSuccess = createAction(
    '[Center] Load Centers Success',
    props<{ centers: Center[] }>()
);

export const loadCentersFailure = createAction(
    '[Center] Load Centers Failure',
    props<{ error: any }>()
);

// Action para carregar um Center específico
export const loadCenter = createAction(
    '[Center] Load Center',
    props<{ id: string }>()
);

// Action para carregar um Center com sucesso
export const loadCenterSuccess = createAction(
    '[Center] Load Center Success',
    props<{ center: Center }>()
);

// Action para erro ao carregar um Center
export const loadCenterFailure = createAction(
    '[Center] Load Center Failure',
    props<{ error: any }>()
);

// Ação para carregar centros paginados
export const loadPagedCenters = createAction(
    '[Center] Load Paged Centers',
    props<{ size: number }>()
);

export const loadPagedCentersSuccess = createAction(
    '[Center] Load Paged Centers Success',
    props<{ centers: Center[] }>()
);

export const loadPagedCentersFailure = createAction(
    '[Center] Load Paged Centers Failure',
    props<{ error: any }>()
);

export const deleteCenter = createAction(
    '[Center] Delete Center',
    props<{ id: string }>()
);

export const deleteCenterSuccess = createAction(
    '[Center] Delete Center Success',
    props<{ id: string }>()
);

export const deleteCenterFailure = createAction(
    '[Center] Delete Center Failure',
    props<{ error: any }>()
);

// Ação para editar um centro
export const updateCenter = createAction(
    '[Center] Update Center',
    props<{ id: string; center: Partial<Center> }>()
);

// Ação para sucesso ao editar um centro
export const updateCenterSuccess = createAction(
    '[Center] Update Center Success',
    props<{ center: Center }>()
);

// Ação para falha ao editar um centro
export const updateCenterFailure = createAction(
    '[Center] Update Center Failure',
    props<{ error: any }>()
);
