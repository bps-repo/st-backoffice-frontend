import {EmployeeFeature} from "./employees.reducer";
import {createSelector} from "@ngrx/store";
import {EmployeesAdapter} from "./employees.state";


const {
    selectError,
    selectErrorCreate,
    selectErrorDelete,
    selectErrorUpdate,
    selectLoading,
    selectSelectedEmployee,
    selectLoadingUpdate,
    selectLoadingCreate,
    selectLoadingDelete
} = EmployeeFeature


const {
    selectEntities,
    selectAll,
    selectTotal,
    selectIds
} = EmployeesAdapter.getSelectors(EmployeeFeature.selectEmployeesState);


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
