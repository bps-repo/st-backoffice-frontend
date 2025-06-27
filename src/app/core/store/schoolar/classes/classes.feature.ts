import {createFeature, createReducer, on} from "@ngrx/store";
import {CLASS_FEATURE_KEY, ClassesActions} from "./classesActions";
import {classAdapter, classesInitialState} from "./classState";

export const classesFeature = createFeature(
    {
        name: CLASS_FEATURE_KEY,
        reducer: createReducer(
            classesInitialState,
            on(ClassesActions.loadClasses, (state) => ({
                ...state,
                loading: true,
                error: null
            })),
            on(ClassesActions.loadClassesSuccess, (state, {classes}) =>
                classAdapter.setAll(classes, {
                    ...state,
                    loading: false,
                    error: null,
                    lastFetch: Date.now(),
                    cacheExpired: false,
                })
            ),
            on(ClassesActions.loadClassesFailure, (state, {error}) => ({
                ...state,
                loading: false,
                error: error
            })),
            on(ClassesActions.loadClass, (state) => ({
                ...state,
                loading: true,
                error: null
            })),
            on(ClassesActions.loadClassSuccess, (state, {classData}) =>
                classAdapter.upsertOne(classData, {
                    ...state,
                    selectedClassId: classData.id,
                    loading: false,
                    error: null
                })
            ),
            on(ClassesActions.loadClassFailure, (state, {error}) => ({
                ...state,
                loading: false,
                error: error
            })),
            on(ClassesActions.createClass, (state) => ({
                ...state,
                loadingCreate: true,
                createError: null,
                createClassSuccess: false
            })),
            on(ClassesActions.createClassSuccess, (state, {classData}) =>
                classAdapter.addOne(classData, {
                    ...state,
                    loading: false,
                    loadingCreate: false,
                    error: null,
                    createError: null,
                    createClassSuccess: true,
                })
            ),
            on(ClassesActions.createClassFailure, (state, {error}) => ({
                ...state,
                loadingCreate: false,
                createError: error,
                createClassSuccess: false
            })),
            on(ClassesActions.updateClass, (state) => ({
                ...state,
                loadingUpdate: true,
                updateError: null
            })),
            on(ClassesActions.updateClassSuccess, (state, {classData}) =>
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
            on(ClassesActions.updateClassFailure, (state, {error}) => ({
                ...state,
                loadingUpdate: false,
                updateError: error
            })),
            on(ClassesActions.deleteClass, (state) => ({
                ...state,
                loadingDelete: true,
                deleteError: null
            })),
            on(ClassesActions.deleteClassSuccess, (state, {id}) =>
                classAdapter.removeOne(id, {
                    ...state,
                    loading: false,
                    loadingDelete: false,
                    error: null,
                    deleteError: null,
                    selectedClassId: state.selectedClassId === id ? null : state.selectedClassId
                })
            ),
            on(ClassesActions.deleteClassFailure, (state, {error}) => ({
                ...state,
                loadingDelete: false,
                deleteError: error
            })),
            on(ClassesActions.clearError, (state) => ({
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
