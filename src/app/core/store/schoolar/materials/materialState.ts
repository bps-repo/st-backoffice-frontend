import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Material } from 'src/app/core/models/academic/material';

export interface MaterialState extends EntityState<Material> {
  // Loading states
  loading: boolean;
  loadingCreate: boolean;
  loadingByActive: boolean;
  loadingByType: boolean;
  loadingByUploader: boolean;

  // Error states
  error: string | null;
  createError: string | null;
  byActiveError: string | null;
  byTypeError: string | null;
  byUploaderError: string | null;

  // Selection state
  selectedMaterialId: string | null;

  // Specialized data
  materialsByActive: { [active: string]: Material[] };
  materialsByType: { [type: string]: Material[] };
  materialsByUploader: { [uploaderId: string]: Material[] };

  // Cache management
  lastFetch: number | null;
  cacheExpired: boolean;
  cacheTimeout: number; // Cache timeout in milliseconds (default: 5 minutes)
}

export const materialsAdapter = createEntityAdapter<Material>({
  selectId: (material: Material) => material.id,
  sortComparer: (a: Material, b: Material) => {
    // Sort by upload date, most recent first
    const dateA = new Date(a.uploadDate).getTime();
    const dateB = new Date(b.uploadDate).getTime();
    return dateB - dateA;
  }
});

export const materialInitialState: MaterialState = materialsAdapter.getInitialState({
  // Loading states
  loading: false,
  loadingCreate: false,
  loadingByActive: false,
  loadingByType: false,
  loadingByUploader: false,

  // Error states
  error: null,
  createError: null,
  byActiveError: null,
  byTypeError: null,
  byUploaderError: null,

  // Selection state
  selectedMaterialId: null,

  // Specialized data
  materialsByActive: {},
  materialsByType: {},
  materialsByUploader: {},

  // Cache management
  lastFetch: null,
  cacheExpired: false,
  cacheTimeout: 5 * 60 * 1000 // 5 minutes in milliseconds
});

