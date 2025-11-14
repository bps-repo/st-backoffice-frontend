import {EmployeeFeature} from "./employees.reducer";
import {createSelector} from "@ngrx/store";
import {employeesAdapter} from "./employees.state";
import {Employee} from "../../../models/corporate/employee";


const {
    selectError,
    selectLoading,
    selectLoadingCreate
} = EmployeeFeature

// Custom selectors for state properties
export const selectErrorCreate = createSelector(
    EmployeeFeature.selectEmployeesState,
    (state) => state.createError
);

export const selectErrorDelete = createSelector(
    EmployeeFeature.selectEmployeesState,
    (state) => state.errorDelete
);

export const selectErrorUpdate = createSelector(
    EmployeeFeature.selectEmployeesState,
    (state) => state.errorUpdate
);

export const selectLoadingUpdate = createSelector(
    EmployeeFeature.selectEmployeesState,
    (state) => state.loadingUpdate
);

export const selectLoadingDelete = createSelector(
    EmployeeFeature.selectEmployeesState,
    (state) => state.loadingDelete
);

export const selectSelectedEmployee = createSelector(
    EmployeeFeature.selectEmployeesState,
    (state) => state.selectedEmployee
);

const {
    selectEntities,
    selectAll,
    selectTotal,
    selectIds
} = employeesAdapter.getSelectors(EmployeeFeature.selectEmployeesState);


export const selectAllEmployees = createSelector(
    selectAll,
    (Employees) => Employees
)

export const selectEmployeeEntities = createSelector(
    selectEntities,
    (entities) => entities
);

export const selectEmployeeById = (id: string) => createSelector(
    selectEmployeeEntities,
    (entities) => entities[id] || null
);


export const selectEmployeeIds = selectIds;

export const selectTotalEmployees = selectTotal;

// Error selectors
export const selectEmployeeAnyError = createSelector(
    selectError,
    selectErrorCreate,
    selectErrorUpdate,
    selectErrorDelete,
    (error, createError, updateError, deleteError) =>
        error || createError || updateError || deleteError
);


export const selectErrorCreateEmployee = selectErrorCreate;

export const selectErrorUpdateEmployee = selectErrorUpdate;

export const selectErrorDeleteEmployee = selectErrorDelete;

export const selectErrorEmployee = selectError;

export const selectLoadingEmployees = selectLoading;

export const selectLoadingCreateEmployee = selectLoadingCreate;

export const selectLoadingUpdateEmployee = selectLoadingUpdate;

export const selectLoadingDeleteEmployee = selectLoadingDelete;

export const selectSelectedEmployeeId = createSelector(
    selectSelectedEmployee,
    (selectedEmployee) => selectedEmployee
);
