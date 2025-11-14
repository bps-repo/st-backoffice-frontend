import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {CreateEmployeeRequest, Employee} from "../../../models/corporate/employee";

export const Employee_FEATURE_KEY = 'employees';

export const EmployeeActions = createActionGroup(
    {
        source: Employee_FEATURE_KEY,
        events: {
            'Load Employees': emptyProps(),
            'Load Employees Success': props<{ Employees: Employee[] }>(),
            'Load Employees Failure': props<{ error: any }>(),

            'Load Employee': props<{ id: string }>(),
            'Load Employee Success': props<{ Employee: Employee }>(),
            'Load Employee Failure': props<{ error: any }>(),

            'Create Employee': props<{ Employee: CreateEmployeeRequest }>(),
            'Create Employee Success': props<{ Employee: Employee }>(),
            'Create Employee Failure': props<{ error: any }>(),

            'Update Employee': props<{ id: string, Employee: Partial<Employee> }>(),
            'Update Employee Success': props<{ Employee: Employee }>(),
            'Update Employee Failure': props<{ error: any }>(),

            'Delete Employee': props<{ id: string }>(),
            'Delete Employee Success': props<{ id: string }>(),
            'Delete Employee Failure': props<{ error: any }>(),


            'Clear Employees': emptyProps(),
            'Clear Employees Errors': emptyProps(),
        }
    }
)
