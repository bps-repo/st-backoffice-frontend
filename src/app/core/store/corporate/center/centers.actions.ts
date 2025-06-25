import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Center, CreateCenter} from "../../../models/corporate/center";

export const CENTER_FEATURE_KEY = 'Center';

export const CenterActions = createActionGroup(
    {
        source: CENTER_FEATURE_KEY,
        events: {
            'Load Centers': emptyProps(),
            'Load Centers Success': props<{ centers: Center[] }>(),
            'Load Centers Failure': props<{ error: any }>(),

            'Load Center': props<{ id: string }>(),
            'Load Center Success': props<{ center: Center }>(),
            'Load Center Failure': props<{ error: any }>(),

            'Create Center': props<{ center: CreateCenter }>(),
            'Create Center Success': props<{ center: Center }>(),
            'Create Center Failure': props<{ error: any }>(),

            'Update Center': props<{ id: string, center: Partial<Center> }>(),
            'Update Center Success': props<{ center: Center }>(),
            'Update Center Failure': props<{ error: any }>(),

            'Delete Center': props<{ id: string }>(),
            'Delete Center Success': props<{ id: string }>(),
            'Delete Center Failure': props<{ error: any }>(),


            'Clear Centers': emptyProps(),
            'Clear Centers Errors': emptyProps(),
        }
    }
)
