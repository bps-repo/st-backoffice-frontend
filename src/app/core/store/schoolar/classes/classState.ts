import {EntityAdapter, EntityState} from "@ngrx/entity";
import {Class} from "../../../models/academic/class";
import {createEntityAdapter} from "@ngrx/entity";

export interface ClassState extends EntityState<Class> {
    // Loading states
    loading: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    // Error states
    errors: any;
    createError: any;
    updateError: any;
    deleteError: any;
    bulkError: any;

    selectedClassId: string | null;
}

export const classAdapter: EntityAdapter<Class> = createEntityAdapter<Class>({
    selectId: (classItem: Class) => classItem.id || '',
    sortComparer: false
});

export const classesInitialState: ClassState = classAdapter.getInitialState({

    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,

    classes: [],

    errors: null,
    createError: null,
    updateError: null,
    deleteError: null,
    bulkError: null,

    selectedClassId: null
});
