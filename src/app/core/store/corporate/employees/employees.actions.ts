import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Employee, CreateEmployeeRequest } from 'src/app/core/models/corporate/employee';

export const EMPLOYEES_FEATURE_KEY = 'employees';

export const EmployeesActions = createActionGroup({
    source: EMPLOYEES_FEATURE_KEY,
    events: {
        'Load Employees': emptyProps(),
        'Load Employees Success': props<{ employees: Employee[] }>(),
        'Load Employees Failure': props<{ error: string }>(),

        'Create Employee': props<{ employeeData: CreateEmployeeRequest }>(),
        'Create Employee Success': props<{ employee: Employee }>(),
        'Create Employee Failure': props<{ error: any }>(),


        'Load Employee By Id': props<{ id: string }>(),
        'Load Employee By Id Success': props<{ employee: Employee }>(),
        'Load Employee By Id Failure': props<{ error: any }>(),

        'Load Employees By Role': props<{ role: string }>(),
        'Load Employees By Role Success': props<{ employees: Employee[], role: string }>(),
        'Load Employees By Role Failure': props<{ error: any }>(),

        'Search Employees': props<{ filters: any }>(),
        'Search Employees Success': props<{ employees: Employee[] }>(),
        'Search Employees Failure': props<{ error: any }>(),

        'Search Employees Paginated': props<{ filters: any, page: number, size: number, sort?: string }>(),
        'Search Employees Paginated Success': props<{ page: any }>(),
        'Search Employees Paginated Failure': props<{ error: any }>(),

        'Load Employees By Center': props<{ centerId: string }>(),
        'Load Employees By Center Success': props<{ employees: Employee[], centerId: string }>(),
        'Load Employees By Center Failure': props<{ error: any }>(),

        'Load Employees By Status': props<{ status: string }>(),
        'Load Employees By Status Success': props<{ employees: Employee[], status: string }>(),
        'Load Employees By Status Failure': props<{ error: any }>(),

        'Clear Error': emptyProps(),
    }
});
