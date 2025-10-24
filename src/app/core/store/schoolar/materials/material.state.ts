import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Material } from 'src/app/core/models/academic/material';

export interface MaterialState extends EntityState<Material> {
    // Loading states
    loading: boolean;
    loadingCreate: boolean;
    loadingByActive: boolean;
    loadingByEntity: boolean;
    loadingByUploader: boolean;

    // Error states
    error: string | null
    createError: string | null
    byActiveError: string | null
    byEntityError: any
    byUploaderError: string | null

    // Selection state
    selectedMaterialId: string | null;

    // Specialized data
    materialsByActive: { [active: string]: Material[] };
    materialsByEntity: { [entity: string]: { [entityId: string]: Material[] } };
    materialsByUploader: { [uploaderId: string]: Material[] };

    // Cache management
    lastFetch: number | null;
    cacheExpired: boolean;
    cacheTimeout: number; // Cache timeout in milliseconds (default: 5 minutes)
}

export const materialsAdapter = createEntityAdapter<Material>({
    selectId: (material: Material) => material.id,
});

export const materialInitialState: MaterialState = materialsAdapter.getInitialState({
    // Loading states
    loading: false,
    loadingCreate: false,
    loadingByActive: false,
    loadingByEntity: false,
    loadingByUploader: false,

    // Error states
    error: null,
    createError: null,
    byActiveError: null,
    byEntityError: null,
    byUploaderError: null,

    // Selection state
    selectedMaterialId: null,

    // Specialized data
    materialsByActive: {},
    materialsByEntity: {},
    materialsByUploader: {},

    // Cache management
    lastFetch: null,
    cacheExpired: false,
    cacheTimeout: 5 * 60 * 1000 // 5 minutes in milliseconds
});

