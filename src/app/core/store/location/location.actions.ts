import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Province, Municipality } from '../../models/location/location';

export const LOCATION_FEATURE_KEY = 'Location';

export const LocationActions = createActionGroup({
    source: LOCATION_FEATURE_KEY,
    events: {
        'Load Provinces': emptyProps(),
        'Load Provinces Success': props<{ provinces: Province[] }>(),
        'Load Provinces Failure': props<{ error: any }>(),

        'Load Province': props<{ provinceId: string }>(),
        'Load Province Success': props<{ province: Province }>(),
        'Load Province Failure': props<{ provinceId: string; error: any }>(),

        'Clear Location Errors': emptyProps(),
    }
});

