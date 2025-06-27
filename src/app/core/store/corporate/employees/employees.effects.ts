import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {EmployeeActions} from "./employee.actions";
import {HttpErrorResponse} from "@angular/common/module.d-CnjH8Dlt";
import {EmployeeService} from "../../../services/corporate/employee.service";

@Injectable()
export class EmployeesEffects {
    constructor(private actions$: Actions, private EmployeeService: EmployeeService) {
    }

    loadEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.loadEmployee),
            mergeMap(({id}) =>
                this.EmployeeService.getEmployeeById(id).pipe(
                    map((response) => EmployeeActions.loadEmployeeSuccess({Employee: response})),
                    catchError((error: HttpErrorResponse) => of(EmployeeActions.loadEmployeeFailure({error: error.message})))
                )
            )
        )
    );

    loadEmployees$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.loadEmployees),
            mergeMap(() =>
                this.EmployeeService.getEmployees().pipe(
                    map((Employees) => EmployeeActions.loadEmployeesSuccess({Employees})),
                    catchError((error: HttpErrorResponse) => of(EmployeeActions.loadEmployeesFailure({error: error.message})))
                )
            )
        )
    );

    deleteEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.deleteEmployee),
            mergeMap(({id}) =>
                this.EmployeeService.deleteEmployee(id).pipe(
                    map(() => EmployeeActions.deleteEmployeeSuccess({id})),
                    catchError((error: HttpErrorResponse) => of(EmployeeActions.deleteEmployeeFailure({error: error.message})))
                )
            )
        )
    );

    createEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.createEmployee),
            mergeMap(({Employee}) =>
                this.EmployeeService.createEmployee(Employee).pipe(
                    map((createdEmployee) => EmployeeActions.createEmployeeSuccess({Employee: createdEmployee})),
                    catchError((error: HttpErrorResponse) => of(EmployeeActions.createEmployeeFailure({error: error.message})))
                )
            )
        )
    );

    updateEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.updateEmployee),
            mergeMap(({id, Employee}) =>
                this.EmployeeService.updateEmployee(id, Employee).pipe(
                    map((updatedEmployee) => EmployeeActions.updateEmployeeSuccess({Employee: updatedEmployee})),
                    catchError((error: HttpErrorResponse) => of(EmployeeActions.updateEmployeeFailure({error: error.message})))
                )
            )
        )
    );
}
