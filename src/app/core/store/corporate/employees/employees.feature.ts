import {createFeature, createReducer, on} from '@ngrx/store';
import {EMPLOYEES_FEATURE_KEY, EmployeesActions} from './employees.actions';
import {employeesAdapter, employeesInitialState} from './employees.state';

export const employeesFeature = createFeature({
  name: EMPLOYEES_FEATURE_KEY,
  reducer: createReducer(
    employeesInitialState,

    on(EmployeesActions.loadEmployees, (state) => ({
      ...state,
      loading: state.ids.length > 0 ? false : true,
      error: null,
    })),
    on(EmployeesActions.loadEmployeesSuccess, (state, {employees}) =>
      employeesAdapter.setAll(employees, {
        ...state,
        loading: false,
        error: null,
      })
    ),
    on(EmployeesActions.loadEmployeesFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    on(EmployeesActions.loadEmployeesByRole, (state) => ({
      ...state,
      loading: state.ids.length > 0 ? false : true,
      error: null,
    })),
    on(EmployeesActions.loadEmployeesByRoleSuccess, (state, {employees, role}) => {
      const newState = employeesAdapter.upsertMany(employees, {
        ...state,
        loading: false,
        error: null,
      });
      return {
        ...newState,
        byRole: {
          ...newState.byRole,
          [role]: employees.map(e => e.id)
        }
      };
    }),
    on(EmployeesActions.loadEmployeesByRoleFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    // Search (non-paginated)
    on(EmployeesActions.searchEmployees, (state) => ({
      ...state,
      loading: state.ids.length > 0 ? false : true,
      error: null,
    })),
    on(EmployeesActions.searchEmployeesSuccess, (state, {employees}) => {
      const newState = employeesAdapter.upsertMany(employees, {
        ...state,
        loading: false,
        error: null,
      });
      return {
        ...newState,
        searchIds: employees.map(e => e.id)
      };
    }),
    on(EmployeesActions.searchEmployeesFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    // Search (paginated)
    on(EmployeesActions.searchEmployeesPaginated, (state) => ({
      ...state,
      loading: state.ids.length > 0 ? false : true,
      error: null,
    })),
    on(EmployeesActions.searchEmployeesPaginatedSuccess, (state, {page}) => {
      const employees = (page?.content || []) as any[];
      const newState = employeesAdapter.upsertMany(employees, {
        ...state,
        loading: false,
        error: null,
      });
      return {
        ...newState,
        searchPage: page
      };
    }),
    on(EmployeesActions.searchEmployeesPaginatedFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    // By center
    on(EmployeesActions.loadEmployeesByCenter, (state) => ({
      ...state,
      loading: state.ids.length > 0 ? false : true,
      error: null,
    })),
    on(EmployeesActions.loadEmployeesByCenterSuccess, (state, {employees, centerId}) => {
      const newState = employeesAdapter.upsertMany(employees, {
        ...state,
        loading: false,
        error: null,
      });
      return {
        ...newState,
        byCenter: {
          ...newState.byCenter,
          [centerId]: employees.map(e => e.id)
        }
      };
    }),
    on(EmployeesActions.loadEmployeesByCenterFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    // By status
    on(EmployeesActions.loadEmployeesByStatus, (state) => ({
      ...state,
      loading: state.ids.length > 0 ? false : true,
      error: null,
    })),
    on(EmployeesActions.loadEmployeesByStatusSuccess, (state, {employees, status}) => {
      const newState = employeesAdapter.upsertMany(employees, {
        ...state,
        loading: false,
        error: null,
      });
      return {
        ...newState,
        byStatus: {
          ...newState.byStatus,
          [status]: employees.map(e => e.id)
        }
      };
    }),
    on(EmployeesActions.loadEmployeesByStatusFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    on(EmployeesActions.clearError, (state) => ({
      ...state,
      error: null,
    })),
  )
});
