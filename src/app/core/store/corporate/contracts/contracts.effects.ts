import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ContractService } from '../../../services/contract.service';
import { ContractActions } from './contracts.actions';

@Injectable()
export class ContractEffects {

    // Load all contracts
    loadContracts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContractActions.loadContracts),
            switchMap(() =>
                this.contractService.getContracts().pipe(
                    map(contracts => {
                        return ContractActions.loadContractsSuccess({ contracts });
                    }),
                    catchError(error => of(ContractActions.loadContractsFailure({ error })))
                )
            )
        )
    );

    // Load single contract
    loadContract$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContractActions.loadContract),
            switchMap(({ id }) =>
                this.contractService.getContractById(id).pipe(
                    map(contract => {
                        return ContractActions.loadContractSuccess({ contract });
                    }),
                    catchError(error => of(ContractActions.loadContractFailure({ error })))
                )
            )
        )
    );

    // Create contract
    createContract$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContractActions.createContract),
            switchMap(({ contract }) =>
                this.contractService.createStudentContract(contract).pipe(
                    map(response => {
                        return ContractActions.createContractSuccess({ contract: response });
                    }),
                    catchError(error => of(ContractActions.createContractFailure({ error })))
                )
            )
        )
    );

    // Load contracts by student
    loadContractsByStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ContractActions.loadContractsByStudent),
            switchMap(({ studentId }) =>
                this.contractService.getContractsByStudent(studentId).pipe(
                    map(contracts => {
                        return ContractActions.loadContractsByStudentSuccess({ contracts });
                    }),
                    catchError(error => of(ContractActions.loadContractsByStudentFailure({ error })))
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private contractService: ContractService
    ) { }
}
