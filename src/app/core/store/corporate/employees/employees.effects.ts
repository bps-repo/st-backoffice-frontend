import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeesActions } from './employees.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class EmployeesEffects {
    private actions$ = inject(Actions);
    private employeeService = inject(EmployeeService);

    loadEmployees$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.loadEmployees),
            exhaustMap(() =>
                this.employeeService.getEmployees().pipe(
                    map((employees) => EmployeesActions.loadEmployeesSuccess({ employees })),
                    catchError((error: HttpErrorResponse | any) =>
                        of(EmployeesActions.loadEmployeesFailure({ error: (error?.message || 'Failed to load employees') }))
                    )
                )
            )
        )
    );

    createEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.createEmployee),
            exhaustMap(({ employeeData }) =>
                this.employeeService.createEmployee(employeeData).pipe(
                    map((employee) => EmployeesActions.createEmployeeSuccess({ employee })),
                    catchError((error: HttpErrorResponse | any) =>
                        of(EmployeesActions.createEmployeeFailure({ error: (error?.message || 'Failed to create employee') }))
                    )
                )
            )
        )
    );

    loadEmployeesByRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.loadEmployeesByRole),
            exhaustMap(({ role }) =>
                this.employeeService.getEmployeesByRole(role).pipe(
                    map((employees) => EmployeesActions.loadEmployeesByRoleSuccess({ employees, role })),
                    catchError((error: HttpErrorResponse | any) =>
                        of(EmployeesActions.loadEmployeesByRoleFailure({ error: (error?.message || 'Failed to load employees by role') }))
                    )
                )
            )
        )
    );


    loadEmployeeById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.loadEmployeeById),
            mergeMap(({ id }) => this.employeeService.getEmployeeById(id).pipe(
                map(employee => EmployeesActions.loadEmployeeByIdSuccess({ employee })),
                catchError((e: HttpErrorResponse) => of(EmployeesActions.loadEmployeeByIdFailure({ error: e.error.message })))
            ))
        )
    )

    // Search (non-paginated)
    searchEmployees$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.searchEmployees),
            exhaustMap(({ filters }) =>
                this.employeeService.searchEmployees(filters).pipe(
                    map((employees) => EmployeesActions.searchEmployeesSuccess({ employees })),
                    catchError((error: HttpErrorResponse | any) =>
                        of(EmployeesActions.searchEmployeesFailure({ error: (error?.message || 'Failed to search employees') }))
                    )
                )
            )
        )
    );

    // Search (paginated)
    searchEmployeesPaginated$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.searchEmployeesPaginated),
            exhaustMap(({ filters, page, size, sort }) =>
                this.employeeService.searchEmployeesPaginated(filters, page, size, sort).pipe(
                    map((pageData) => EmployeesActions.searchEmployeesPaginatedSuccess({ page: pageData })),
                    catchError((error: HttpErrorResponse | any) =>
                        of(EmployeesActions.searchEmployeesPaginatedFailure({ error: (error?.message || 'Failed to search employees (paginated)') }))
                    )
                )
            )
        )
    );

    // By center
    loadEmployeesByCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.loadEmployeesByCenter),
            exhaustMap(({ centerId }) =>
                this.employeeService.getEmployeesByCenter(centerId).pipe(
                    map((employees) => EmployeesActions.loadEmployeesByCenterSuccess({ employees, centerId })),
                    catchError((error: HttpErrorResponse | any) =>
                        of(EmployeesActions.loadEmployeesByCenterFailure({ error: (error?.message || 'Failed to load employees by center') }))
                    )
                )
            )
        )
    );

    // By status
    loadEmployeesByStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.loadEmployeesByStatus),
            exhaustMap(({ status }) =>
                this.employeeService.getEmployeesByStatus(status).pipe(
                    map((employees) => EmployeesActions.loadEmployeesByStatusSuccess({ employees, status })),
                    catchError((error: HttpErrorResponse | any) =>
                        of(EmployeesActions.loadEmployeesByStatusFailure({ error: (error?.message || 'Failed to load employees by status') }))
                    )
                )
            )
        )
    );
}
