import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Unit } from 'src/app/core/models/course/unit';

export interface UnitState extends EntityState<Unit> {
  // Loading states
  loading: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  loadingMaterials: boolean;
  loadingClasses: boolean;
  loadingProgresses: boolean;
  loadingRemoveMaterial: boolean;
  loadingUpdateOrder: boolean;

  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  materialsError: string | null;
  classesError: string | null;
  progressesError: string | null;
  removeMaterialError: string | null;
  updateOrderError: string | null;

  // Selection state
  selectedUnitId: string | null;

  // Specialized data
  unitMaterials: { [unitId: string]: any[] };
  unitClasses: { [unitId: string]: any[] };
  unitProgresses: { [unitId: string]: any[] };

  // Pagination
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;

  // Cache management
  lastFetch: number | null;
  cacheExpired: boolean;
  cacheTimeout: number; // Cache timeout in milliseconds (default: 5 minutes)
}

export const unitsAdapter = createEntityAdapter<Unit>({
  selectId: (unit: Unit) => unit.id,
  sortComparer: (a: Unit, b: Unit) => {
    // Sort by order if available, otherwise by name
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return a.name.localeCompare(b.name);
  }
});

export const unitInitialState: UnitState = unitsAdapter.getInitialState({
  // Loading states
  loading: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  loadingMaterials: false,
  loadingClasses: false,
  loadingProgresses: false,
  loadingRemoveMaterial: false,
  loadingUpdateOrder: false,

  // Error states
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  materialsError: null,
  classesError: null,
  progressesError: null,
  removeMaterialError: null,
  updateOrderError: null,

  // Selection state
  selectedUnitId: null,

  // Specialized data
  unitMaterials: {},
  unitClasses: {},
  unitProgresses: {},

  // Pagination
  currentPage: 0,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,

  // Cache management
  lastFetch: null,
  cacheExpired: false,
  cacheTimeout: 5 * 60 * 1000 // 5 minutes in milliseconds
});

