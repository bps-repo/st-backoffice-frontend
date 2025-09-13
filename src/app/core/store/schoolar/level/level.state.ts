import {Level} from "../../../models/course/level";
import {createEntityAdapter, EntityState} from "@ngrx/entity";

export interface LevelState extends EntityState<Level> {
    loading: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    error: any;
    createError: any;
    updateError: any;
    deleteError: any;
    selectedLevelId: string | null;

    // Cache management
    lastFetch: number | null;
    cacheExpired: boolean;
    cacheTimeout: number; // Cache timeout in milliseconds (default: 30 minutes)
}

export const levelsAdapter = createEntityAdapter<Level>({
    selectId: (level: Level) => level.id,
    sortComparer: false
});

export const levelInitialState: LevelState = levelsAdapter.getInitialState({
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,

    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    selectedLevelId: null,

    // Cache management
    lastFetch: null,
    cacheExpired: false,
    cacheTimeout: 30 * 60 * 1000 // 30 minutes in milliseconds
});
