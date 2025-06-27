import {EntityState} from "@ngrx/entity";
import {createEntityAdapter} from "@ngrx/entity";
import {Employee} from "../../../models/corporate/employee";

export interface EmployeesState extends EntityState<Employee> {
    loading: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    error: any;
    errorCreate: any;
    errorUpdate: any;
    errorDelete: any;

    selectedEmployee: Employee | null;
}

export const EmployeesAdapter = createEntityAdapter<Employee>({
    selectId: (employee: Employee) => employee.id,
    sortComparer: false
});

export const EmployeeInitialState: EmployeesState = EmployeesAdapter.getInitialState({
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    errorCreate: null,
    errorUpdate: null,
    errorDelete: null,
    selectedEmployee: null
});
