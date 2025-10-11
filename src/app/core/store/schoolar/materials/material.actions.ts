import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Material } from 'src/app/core/models/academic/material';

export const MATERIAL_FEATURE_KEY = 'materials';

export const MaterialActions = createActionGroup({
    source: MATERIAL_FEATURE_KEY,
    events: {
        // Get all materials
        'Load Materials': emptyProps(),
        'Load Materials Success': props<{ materials: Material[] }>(),
        'Load Materials Failure': props<{ error: string }>(),

        // Create material
        'Create Material': props<{ material: Partial<Material> }>(),
        'Create Material Success': props<{ material: Material }>(),
        'Create Material Failure': props<{ error: string }>(),

        // Create material with relations
        'Create Material With Relations': props<{ request: import('src/app/core/models/academic/material').MaterialCreateRequest }>(),
        'Create Material With Relations Success': props<{ material: Material }>(),
        'Create Material With Relations Failure': props<{ error: string }>(),

        // Get materials by active status
        'Load Materials By Active': props<{ active: boolean }>(),
        'Load Materials By Active Success': props<{ active: boolean, materials: Material[] }>(),
        'Load Materials By Active Failure': props<{ error: string }>(),

        // Get materials by entity
        'Load Materials By Entity': props<{ entity: string, entityId: string }>(),
        'Load Materials By Entity Success': props<{ entity: string, entityId: string, materials: Material[] }>(),
        'Load Materials By Entity Failure': props<{ byEntityError: any }>(),

        // Get materials by uploader
        'Load Materials By Uploader': props<{ uploaderId: string }>(),
        'Load Materials By Uploader Success': props<{ uploaderId: string, materials: Material[] }>(),
        'Load Materials By Uploader Failure': props<{ error: string }>(),

        // Selection actions
        'Select Material': props<{ id: string }>(),
        'Clear Selected Material': emptyProps(),

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
