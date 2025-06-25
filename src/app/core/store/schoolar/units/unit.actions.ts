import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Unit } from 'src/app/core/models/course/unit';
import { Class } from 'src/app/core/models/academic/class';

export const UNIT_FEATURE_KEY = 'units';

export const UnitActions = createActionGroup({
  source: UNIT_FEATURE_KEY,
  events: {
    // Basic CRUD operations
    'Create Unit': props<{ unit: Partial<Unit> }>(),
    'Create Unit Success': props<{ unit: Unit }>(),
    'Create Unit Failure': props<{ error: string }>(),

    'Update Unit': props<{ id: string, unit: Partial<Unit> }>(),
    'Update Unit Success': props<{ unit: Unit }>(),
    'Update Unit Failure': props<{ error: string }>(),

    'Get Unit': props<{ id: string }>(),
    'Get Unit Success': props<{ unit: Unit }>(),
    'Get Unit Failure': props<{ error: string }>(),

    'Get Paged Units': props<{ size: number }>(),
    'Get Paged Units Success': props<{ units: Unit[], pagination: any }>(),
    'Get Paged Units Failure': props<{ error: string }>(),

    'Delete Unit': props<{ id: string }>(),
    'Delete Unit Success': props<{ id: string }>(),
    'Delete Unit Failure': props<{ error: string }>(),

    // Specialized endpoints
    'Get Unit Materials': props<{ unitId: string }>(),
    'Get Unit Materials Success': props<{ unitId: string, materials: any[] }>(),
    'Get Unit Materials Failure': props<{ error: string }>(),

    'Remove Material From Unit': props<{ unitId: string, materialId: string }>(),
    'Remove Material From Unit Success': props<{ unit: Unit }>(),
    'Remove Material From Unit Failure': props<{ error: string }>(),

    'Update Unit Order': props<{ unitId: string, order: number }>(),
    'Update Unit Order Success': props<{ unit: Unit }>(),
    'Update Unit Order Failure': props<{ error: string }>(),

    'Get Unit Classes': props<{ unitId: string }>(),
    'Get Unit Classes Success': props<{ unitId: string, classes: Class[] }>(),
    'Get Unit Classes Failure': props<{ error: string }>(),

    'Get Unit Progresses': props<{ unitId: string }>(),
    'Get Unit Progresses Success': props<{ unitId: string, progresses: any[] }>(),
    'Get Unit Progresses Failure': props<{ error: string }>(),

    // Selection actions
    'Select Unit': props<{ id: string }>(),
    'Clear Selected Unit': emptyProps(),

    // Pagination actions
    'Set Page': props<{ page: number }>(),
    'Set Page Size': props<{ size: number }>(),

    // Cache management
    'Set Last Fetch': props<{ timestamp: number }>(),
    'Set Cache Expired': props<{ expired: boolean }>(),
    'Refresh Cache': emptyProps(),
    'Clear Cache': emptyProps(),

    // Clear errors
    'Clear Error': props<{ errorType: string }>(),
    'Clear All Errors': emptyProps(),
  },
});
