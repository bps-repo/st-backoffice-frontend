import { createFeature, createReducer, on } from '@ngrx/store';
import { levelInitialState, levelsAdapter } from "./level.state";
import { LevelActions, LEVEL_FEATURE_KEY } from "./level.actions";

export const levelsFeature = createFeature({
    name: LEVEL_FEATURE_KEY,
    reducer: createReducer(
        levelInitialState,

        on(LevelActions.createLevel, state => ({
            ...state,
            loadingCreate: true,
            createError: null
        })),
        on(LevelActions.createLevelSuccess, (state, { level }) => levelsAdapter.setOne(
            level,
            {
                ...state,
                loadingCreate: false,
                createError: null
            }
        )),
        on(LevelActions.createLevelFailure, (state, { error }) => ({
            ...state,
            loadingCreate: false,
            createError: error
        })),


        on(LevelActions.loadLevels, (state) => ({
            ...state,
            loading: state.ids.length > 0 ? false : true,
            error: null,
        })),
        on(LevelActions.loadLevelsSuccess, (state, { levels }) => levelsAdapter.setAll(
            levels,
            {
                ...state,
                loading: false,
                error: null,
                lastFetch: Date.now(),
                cacheExpired: false
            }
        )),
        on(LevelActions.loadLevelsFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),
        on(LevelActions.loadLevel, (state, { id }) => ({
            ...state,
            loading: true,
            error: null,
            selectedLevelId: id
        })),
        on(LevelActions.loadLevelSuccess, (state, { level }) => levelsAdapter.setOne(
            level,
            {
                ...state,
                loading: false,
                error: null,
                selectedLevelId: level.id
            }
        )),
        on(LevelActions.loadLevelFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
            selectedLevelId: null
        })),
        on(LevelActions.deleteLevel, state => ({
            ...state,
            loadingDelete: true,
            error: null
        })),
        on(LevelActions.deleteLevelSuccess, (state, { id }) => levelsAdapter.removeOne(
            id,
            {
                ...state,
                loadingDelete: false,
                error: null
            }
        )),
        on(LevelActions.deleteLevelFailure, (state, { error }) => ({
            ...state,
            loadingDelete: false,
            error
        })),
        on(LevelActions.updateLevel, state => ({
            ...state,
            loadingUpdate: true,
            updateError: null
        })),
        on(LevelActions.updateLevelSuccess, (state, { level }) => levelsAdapter.updateOne(
            { id: level.id, changes: level },
            {
                ...state,
                loadingUpdate: false,
                updateError: null
            }
        )),
        on(LevelActions.updateLevelFailure, (state, { error }) => ({
            ...state,
            loadingUpdate: false,
            updateError: error
        })),
        on(LevelActions.selectLevel, (state, { id }) => ({
            ...state,
            selectedLevelId: id
        })),
        on(LevelActions.clearErrors, (state) => ({
            ...state,
            error: null,
            createError: null,
            updateError: null,
            deleteError: null
        })),

        // Cache management
        on(LevelActions.setLastFetch, (state, { timestamp }) => ({
            ...state,
            lastFetch: timestamp,
        })),
        on(LevelActions.setCacheExpired, (state, { expired }) => ({
            ...state,
            cacheExpired: expired,
        })),
        on(LevelActions.refreshCache, (state) => ({
            ...state,
            cacheExpired: true,
        })),
        on(LevelActions.clearCache, (state) =>
            levelsAdapter.removeAll({
                ...state,
                lastFetch: null,
                cacheExpired: false,
            })
        )
    )
});

