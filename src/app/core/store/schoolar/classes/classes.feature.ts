import {createFeature, createReducer, on} from "@ngrx/store";
import {CLASS_FEATURE_KEY, classesActions} from "./classes.actions";
import {classesInitialState} from "./classState";

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
            on(classesActions.loadClassesSuccess, (state, {classes}) => ({
                ...state,
                classes,
                loading: false
            })),
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
            on(classesActions.loadClassSuccess, (state, {classData}) => ({
                ...state,
                selectedClassId: classData.id,
                classData: classData,
                loading: false
            })),
            on(classesActions.loadClassFailure, (state, {error}) => ({
                ...state,
                loading: false,
                error: error
            })),
            on(classesActions.createClass, (state) => ({
                ...state,
                loading: true,
                error: null
            })),
            on(classesActions.createClassSuccess, (state, {classData}) => ({
                ...state,
                //classes: [...state.classes, classData],
                loading: false
            })),
            on(classesActions.createClassFailure, (state, {error}) => ({
                ...state,
                loading: false,
                error: error
            })),
            on(classesActions.updateClass, (state) => ({
                ...state,
                loading: true,
                error: null
            })),
            on(classesActions.updateClassSuccess, (state, {classData}) => ({
                ...state,
                // classes: state.classes.map(c => c.id === classData.id ? classData : c),
                loading: false
            })),
            on(classesActions.updateClassFailure, (state, {error}) => ({
                ...state,
                loading: false,
                error: error
            })),
            on(classesActions.deleteClass, (state) => ({
                ...state,
                loading: true,
                error: null
            })),
            on(classesActions.deleteClassSuccess, (state, {id}) => ({
                ...state,
                // classes: state.classes.filter(c => c.id !== id),
                loading: false
            })),
            on(classesActions.deleteClassFailure, (state, {error}) => ({
                ...state,
                loading: false,
                error: error
            })),
            on(classesActions.clearError, (state, {error}) => ({
                ...state,
                error: null
            }))
        )
    }
)
