import {createActionGroup, emptyProps, props} from '@ngrx/store';

export const EMPLOYEES_FEATURE_KEY = 'employees';

export interface EmployeeAny {
  // Keep it flexible because backend returns nested user info in some endpoints
  id: string;
  [key: string]: any;
}

export const EmployeesActions = createActionGroup({
  source: EMPLOYEES_FEATURE_KEY,
  events: {
    'Load Employees': emptyProps(),
    'Load Employees Success': props<{ employees: EmployeeAny[] }>(),
    'Load Employees Failure': props<{ error: string }>(),

    'Load Employees By Role': props<{ role: string }>(),
    'Load Employees By Role Success': props<{ employees: EmployeeAny[], role: string }>(),
    'Load Employees By Role Failure': props<{ error: string }>(),

    'Search Employees': props<{ filters: any }>(),
    'Search Employees Success': props<{ employees: EmployeeAny[] }>(),
    'Search Employees Failure': props<{ error: string }>(),

    'Search Employees Paginated': props<{ filters: any, page: number, size: number, sort?: string }>(),
    'Search Employees Paginated Success': props<{ page: any }>(),
    'Search Employees Paginated Failure': props<{ error: string }>(),

    'Load Employees By Center': props<{ centerId: string }>(),
    'Load Employees By Center Success': props<{ employees: EmployeeAny[], centerId: string }>(),
    'Load Employees By Center Failure': props<{ error: string }>(),

    'Load Employees By Status': props<{ status: string }>(),
    'Load Employees By Status Success': props<{ employees: EmployeeAny[], status: string }>(),
    'Load Employees By Status Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
  }
});
