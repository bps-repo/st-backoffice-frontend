import {createFeature, createReducer, on} from '@ngrx/store';

import {Employee_FEATURE_KEY, EmployeeActions} from "./employee.actions";
import {EmployeeInitialState, EmployeesAdapter} from "./employees.state";

export const EmployeeFeature = createFeature({
    name: Employee_FEATURE_KEY,
    reducer: createReducer(
        EmployeeInitialState,

        // Create Employee
        on(EmployeeActions.createEmployee, (state) => ({
            ...state,
            loadingCreate: true,
            errorCreate: null
        })),
        on(EmployeeActions.createEmployeeSuccess, (state, {Employee}) => EmployeesAdapter.addOne(Employee, {
            ...state,
            loadingCreate: false,
            errorCreate: null
        })),
        on(EmployeeActions.createEmployeeFailure, (state, {error}) => ({
            ...state,
            loadingCreate: false,
            errorCreate: error
        })),

        // Load all Employees
        on(EmployeeActions.loadEmployees, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(EmployeeActions.loadEmployeesSuccess, (state, {Employees}) => EmployeesAdapter.setAll(Employees, {
            ...state,
            loading: false,
            error: null
        })),
        on(EmployeeActions.loadEmployeesFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),

        // Load Employee
        on(EmployeeActions.loadEmployee, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(EmployeeActions.loadEmployeeSuccess, (state, {Employee}) => ({
            ...state,
            selectedEmployee: Employee,
            loading: false,
            error: null
        })),

        on(EmployeeActions.loadEmployeeFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),

        // Delete Employee
        on(EmployeeActions.deleteEmployee, (state) => ({
            ...state,
            loadingDelete: true,
            errorDelete: null
        })),

        on(EmployeeActions.deleteEmployeeSuccess, (state, {id}) =>
            EmployeesAdapter.removeOne(id, {
                ...state,
                loadingDelete: false,
                errorDelete: null
            })
        ),

        on(EmployeeActions.deleteEmployeeFailure, (state, {error}) => ({
            ...state,
            loadingDelete: false,
            errorDelete: error
        })),


        // Update Employee
        on(EmployeeActions.updateEmployee, (state) => ({
            ...state,
            loadingUpdate: true,
            errorUpdate: null
        })),
        on(EmployeeActions.updateEmployeeSuccess, (state, {Employee}) => EmployeesAdapter.updateOne({
            id: Employee.id,
            changes: Employee
        }, {
            ...state,
            loadingUpdate: false,
            errorUpdate: null
        })),
        on(EmployeeActions.updateEmployeeFailure, (state, {error}) => ({
            ...state,
            loadingUpdate: false,
            errorUpdate: error
        })),

        // Clear Employees
        on(EmployeeActions.clearEmployees, (state) => ({
            ...state,
            ...EmployeeInitialState
        })),
        // Clear Employees errors
        on(EmployeeActions.clearEmployeesErrors, (state) => ({
            ...state,
            error: null,
            errorCreate: null,
            errorUpdate: null,
            errorDelete: null
        })),
    )
});
