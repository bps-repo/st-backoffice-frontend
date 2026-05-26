import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Service } from "src/app/core/models/course/service";

export const serviceFeatureKey = 'service';

export interface ServiceState extends EntityState<Service> {

    // Loading states
    loading: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    // Error states
    error: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    selectedServiceId: string | null;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export const serviceAdapter = createEntityAdapter<Service>();


export const initialState: ServiceState = {
    ids: [],
    entities: {},
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    selectedServiceId: null,
    page: 0,
    size: 15,
    totalElements: 0,
    totalPages: 0,
};
