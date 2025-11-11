import { Province, Municipality } from '../../models/location/location';

export interface LocationState {
    provinces: Province[];
    municipalities: { [provinceId: string]: Municipality[] };
    
    loadingProvinces: boolean;
    loadingMunicipalities: { [provinceId: string]: boolean };
    
    error: any;
    errorProvinces: any;
    errorMunicipalities: { [provinceId: string]: any };
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

