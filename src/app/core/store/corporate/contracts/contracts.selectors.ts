import {createSelector} from '@ngrx/store';
import {contractsAdapter} from './contracts.state';
import {contractsFeature} from './contracts.feature';
import {Contract} from 'src/app/core/models/corporate/contract';


const {
    selectError,
    selectLoading,
    selectSelectedContract,
    selectLoadingCreate,
    selectLoadingDelete,
} = contractsFeature

const {
    selectAll,
} = contractsAdapter.getSelectors(contractsFeature.selectContractState);


export const selectDownloading = createSelector(
    contractsFeature.selectContractState,
    (state) => state.downloading
);

export const selectSelectedContractByID = selectSelectedContract;

export const selectAllContracts = selectAll;

export const selectContractsLoading = selectLoading;

export const selectContractsLoadingCreate = selectLoadingCreate;

export const selectSelectedContractId = createSelector(
    selectSelectedContract,
    (selectedContract) => selectedContract?.id
);

export const selectContractsLoadingDelete = selectLoadingDelete;

export const selectContractsError = createSelector(
    selectError,
    (error) => error
);


export const selectContractById = (id: string) => createSelector(
    selectAllContracts,
    (contracts) => contracts.find((contract: Contract) => contract.id === id)
);

/** Returns contracts for a specific student using the scoped id map, falling back to entity filter. */
export const selectContractsByStudent = (studentId: string) => createSelector(
    contractsFeature.selectContractState,
    selectAllContracts,
    (state, allContracts) => {
        const ids = state.contractsByStudentId[studentId];
        if (ids) {
            const entityMap = state.entities;
            return ids.map((id) => entityMap[id]).filter((c): c is Contract => !!c);
        }
        return allContracts.filter((c) => c.student?.id === studentId);
    }
)

export const selectContractsByStatus = (status: string) => createSelector(
    selectAllContracts,
    (contracts) => contracts.filter((contract: Contract) => contract.status === status)
);

export const selectActiveContracts = createSelector(
    selectAllContracts,
    (contracts) => contracts.filter((contract: Contract) => contract.status === 'ACTIVE')
);

export const selectContractsByType = (type: string) => createSelector(
    selectAllContracts,
    (contracts) => contracts.filter((contract: Contract) => contract.contractType === type)
);

export const selectContractsCount = createSelector(
    selectAllContracts,
    (contracts) => contracts.length
);

export const selectActiveContractsCount = createSelector(
    selectActiveContracts,
    (contracts) => contracts.length
);
