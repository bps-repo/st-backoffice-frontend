import {Center} from "../../../models/corporate/center";
import {EntityState} from "@ngrx/entity";
import {createEntityAdapter} from "@ngrx/entity";

export interface CenterState extends EntityState<Center> {
    loading: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    error: any;
    errorCreate: any;
    errorUpdate: any;
    errorDelete: any;

    selectedCenter: Center | null;
}

export const centersAdapter = createEntityAdapter<Center>({
    selectId: (center: Center) => center.id,
    sortComparer: (a: Center, b: Center) => a.name.localeCompare(b.name)
});

export const centerInitialState: CenterState = centersAdapter.getInitialState({
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    errorCreate: null,
    errorUpdate: null,
    errorDelete: null,
    selectedCenter: null
});
