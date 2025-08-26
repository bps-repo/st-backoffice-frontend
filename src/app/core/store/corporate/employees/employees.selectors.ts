import {createSelector} from '@ngrx/store';
import {employeesAdapter} from './employees.state';
import {employeesFeature} from './employees.feature';

export const {
  selectEmployeesState,
  selectLoading,
  selectError,
} = employeesFeature;

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = employeesAdapter.getSelectors(employeesFeature.selectEmployeesState);

export const selectAllEmployees = selectAll;
export const selectEmployeeEntities = selectEntities;
export const selectEmployeeIds = selectIds;
export const selectTotalEmployees = selectTotal;

export const selectEmployeesByRole = (role: string) => createSelector(
  selectEmployeeEntities,
  employeesFeature.selectEmployeesState,
  (entities, state) => {
    const ids = state.byRole[role] || [];
    return ids.map(id => entities[id]).filter(Boolean);
  }
);

export const selectEmployeesByCenter = (centerId: string) => createSelector(
  selectEmployeeEntities,
  employeesFeature.selectEmployeesState,
  (entities, state) => {
    const ids = state.byCenter[centerId] || [];
    return ids.map(id => entities[id]).filter(Boolean);
  }
);

export const selectEmployeesByStatus = (status: string) => createSelector(
  selectEmployeeEntities,
  employeesFeature.selectEmployeesState,
  (entities, state) => {
    const ids = state.byStatus[status] || [];
    return ids.map(id => entities[id]).filter(Boolean);
  }
);

export const selectSearchResults = createSelector(
  selectEmployeeEntities,
  employeesFeature.selectEmployeesState,
  (entities, state) => state.searchIds.map(id => entities[id]).filter(Boolean)
);

export const selectSearchPage = createSelector(
  employeesFeature.selectEmployeesState,
  (state) => state.searchPage
);
