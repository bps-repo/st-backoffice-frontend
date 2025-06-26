import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Level} from "../../../models/course/level";

export const LEVEL_FEATURE_KEY = "levels";

export const LevelActions = createActionGroup(
    {
        source: LEVEL_FEATURE_KEY,
        events: {
            'Create Level': props<{ level: Partial<Level> }>(),
            'Create Level Success': props<{ level: Level }>(),
            'Create Level Failure': props<{ error: any }>(),
            'Load Levels': emptyProps(),
            'Load Levels Success': props<{ levels: Level[] }>(),
            'Load Levels Failure': props<{ error: any }>(),
            'Load Level': props<{ id: string }>(),
            'Load Level Success': props<{ level: Level }>(),
            'Load Level Failure': props<{ error: any }>(),
            'Delete Level': props<{ id: string }>(),
            'Delete Level Success': props<{ id: string }>(),
            'Delete Level Failure': props<{ error: any }>(),
            'Update Level': props<{ id: string, level: Partial<Level> }>(),
            'Update Level Success': props<{ level: Level }>(),
            'Update Level Failure': props<{ error: any }>(),
            'Select Level': props<{ id: string }>(),
            'Clear errors': emptyProps(),
        }
    }
)
