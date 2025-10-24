import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Unit } from 'src/app/core/models/course/unit';

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

        'Load Unit': props<{ id: string }>(),
        'Load Unit Success': props<{ unit: Unit }>(),
        'Load Unit Failure': props<{ error: string }>(),


        'Load Units By LevelId': props<{ levelId: string }>(),
        'Load Unit By LevelId Success': props<{ units: Unit[] }>(),
        'Load Unit By LevelId Failure': props<{ error: any }>(),

        'Load  Units': emptyProps(),
        'Load  Units Success': props<{ units: Unit[] }>(),
        'Load  Units Failure': props<{ error: string }>(),

        'Delete Unit': props<{ id: string }>(),
        'Delete Unit Success': props<{ id: string }>(),
        'Delete Unit Failure': props<{ error: string }>(),

        // Specialized endpoints
        'Load Unit Materials': props<{ unitId: string }>(),
        'Load Unit Materials Success': props<{ unitId: string, materials: any[] }>(),
        'Load Unit Materials Failure': props<{ error: string }>(),

        'Remove Material From Unit': props<{ unitId: string, materialId: string }>(),
        'Remove Material From Unit Success': props<{ unit: Unit }>(),
        'Remove Material From Unit Failure': props<{ error: string }>(),

        'Update Unit Order': props<{ unitId: string, order: number }>(),
        'Update Unit Order Success': props<{ unit: Unit }>(),
        'Update Unit Order Failure': props<{ error: string }>(),

        'Load Unit Progresses': props<{ unitId: string }>(),
        'Load Unit Progresses Success': props<{ unitId: string, progresses: any[] }>(),
        'Load Unit Progresses Failure': props<{ error: string }>(),

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
