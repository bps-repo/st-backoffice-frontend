import {createFeature, createReducer, on} from '@ngrx/store';
import {levelInitialState, levelsAdapter} from "./level.state";
import {LEVEL_FEATURE_KEY, LevelActions} from "./level.actions";

export const levelsFeature = createFeature({
    name: LEVEL_FEATURE_KEY,
    reducer: createReducer(
        levelInitialState,

        on(LevelActions.createLevel, state => ({
            ...state,
            loadingCreate: true,
            createError: null,
            createLevelSuccess: false
        })),
        on(LevelActions.createLevelSuccess, (state, {level}) => levelsAdapter.setOne(
            level,
            {
                ...state,
                loadingCreate: false,
                createError: null,
                createLevelSuccess: true
            }
        )),
        on(LevelActions.createLevelFailure, (state, {error}) => ({
            ...state,
            loadingCreate: false,
            createError: error,
            createLevelSuccess: false
        })),


        on(LevelActions.loadLevels, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(LevelActions.loadLevelsSuccess, (state, {levels}) => levelsAdapter.setAll(
            levels,
            {
                ...state,
                loading: false,
                error: null
            }
        )),
        on(LevelActions.loadLevelsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),
        on(LevelActions.loadLevel, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(LevelActions.loadLevelSuccess, (state, {level}) => ({
            ...state,
            level: level,
            loading: false,
            error: null,
        })),
        on(LevelActions.loadLevelFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),
        on(LevelActions.deleteLevel, state => ({
            ...state,
            loadingDelete: true,
            deleteError: null
        })),
        on(LevelActions.deleteLevelSuccess, (state, {id}) => levelsAdapter.removeOne(
            id,
            {
                ...state,
                loadingDelete: false,
                deleteError: null
            }
        )),
        on(LevelActions.deleteLevelFailure, (state, {error}) => ({
            ...state,
            loadingDelete: false,
            deleteError: error
        })),
        on(LevelActions.updateLevel, state => ({
            ...state,
            loadingUpdate: true,
            updateError: null
        })),
        on(LevelActions.updateLevelSuccess, (state, {level}) => ({
            ...state,
            level,
            loadingUpdate: false,
            updateError: null
        })),
        on(LevelActions.updateLevelFailure, (state, {error}) => ({
            ...state,
            loadingUpdate: false,
            updateError: error
        }))
    )
});
