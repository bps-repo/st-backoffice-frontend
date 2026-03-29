import {Province, Municipality} from '../../models/location/location';

export interface LocationState {
    provinces: Province[];
    municipalities: Record<string, Municipality[]>;

    loadingProvinces: boolean;
    loadingMunicipalities: Record<string, boolean>;

    error: any;
    errorProvinces: any;
    errorMunicipalities: Record<string, any>;
}

export const locationInitialState: LocationState = {
    provinces: [],
    municipalities: {},
    loadingProvinces: false,
    loadingMunicipalities: {},
    error: null,
    errorProvinces: null,
    errorMunicipalities: {}
};

