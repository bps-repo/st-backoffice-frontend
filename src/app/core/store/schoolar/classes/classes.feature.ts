import {createFeature, createReducer, on} from "@ngrx/store";
import {CLASS_FEATURE_KEY, classesActions} from "./classes.actions";
import {classAdapter, classesInitialState} from "./classState";

export const classesFeature = createFeature(
    {
        name: CLASS_FEATURE_KEY,
        reducer: createReducer(
            classesInitialState,
            on(classesActions.loadClasses, (state) => ({
                ...state,
                loading: true,
                error: null
            })),
            on(classesActions.loadClassesSuccess, (state, {classes}) =>
                classAdapter.setAll(classes, {
                    ...state,
                    loading: false,
                    error: null,
                    lastFetch: Date.now(),
                    cacheExpired: false,
                })
            ),
            on(classesActions.loadClassesFailure, (state, {error}) => ({
                ...state,
                loading: false,
                error: error
            })),
            on(classesActions.loadClass, (state) => ({
                ...state,
                loading: true,
                error: null
            })),
            on(classesActions.loadClassSuccess, (state, {classData}) =>
                classAdapter.upsertOne(classData, {
                    ...state,
                    selectedClassId: classData.id,
                    loading: false,
                    error: null
                })
            ),
            on(classesActions.loadClassFailure, (state, {error}) => ({
                ...state,
                loading: false,
                error: error
            })),
            on(classesActions.createClass, (state) => ({
                ...state,
                loadingCreate: true,
                createError: null,
                createClassSuccess: false
            })),
            on(classesActions.createClassSuccess, (state, {classData}) =>
                classAdapter.addOne(classData, {
                    ...state,
                    loading: false,
                    loadingCreate: false,
                    error: null,
                    createError: null,
                    createClassSuccess: true,
                })
            ),
            on(classesActions.createClassFailure, (state, {error}) => ({
                ...state,
                loadingCreate: false,
                createError: error,
                createClassSuccess: false
            })),
            on(classesActions.updateClass, (state) => ({
                ...state,
                loadingUpdate: true,
                updateError: null
            })),
            on(classesActions.updateClassSuccess, (state, {classData}) =>
                classAdapter.updateOne(
                    {id: classData.id, changes: classData},
                    {
                        ...state,
                        loading: false,
                        loadingUpdate: false,
                        error: null,
                        updateError: null
                    }
                )
            ),
            on(classesActions.updateClassFailure, (state, {error}) => ({
                ...state,
                loadingUpdate: false,
                updateError: error
            })),
            on(classesActions.deleteClass, (state) => ({
                ...state,
                loadingDelete: true,
                deleteError: null
            })),
            on(classesActions.deleteClassSuccess, (state, {id}) =>
                classAdapter.removeOne(id, {
                    ...state,
                    loading: false,
                    loadingDelete: false,
                    error: null,
                    deleteError: null,
                    selectedClassId: state.selectedClassId === id ? null : state.selectedClassId
                })
            ),
            on(classesActions.deleteClassFailure, (state, {error}) => ({
                ...state,
                loadingDelete: false,
                deleteError: error
            })),
            on(classesActions.clearError, (state) => ({
                ...state,
                errors: null,
                error: null,
                createError: null,
                updateError: null,
                deleteError: null,
                bulkError: null
            }))
        )
    }
)
