import { createFeature, createReducer, on } from '@ngrx/store';
import { CONTRACT_FEATURE_KEY, ContractActions } from './contracts.actions';
import { contractsAdapter, initialContractState } from './contracts.state';


export const contractsFeature = createFeature({
    name: CONTRACT_FEATURE_KEY,
    reducer: createReducer(
        initialContractState,

        // Load Contracts
        on(ContractActions.loadContracts, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(ContractActions.loadContractsSuccess, (state, { contracts }) => contractsAdapter.setAll(contracts, {
            ...state,
            loading: false,
            error: null,
            lastUpdated: new Date().toISOString()
        })),
        on(ContractActions.loadContractsFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),

        // Load Single Contract
        on(ContractActions.loadContract, (state) => ({
            ...state,
            loading: true,
            error: null,
            selectedContract: null,
        })),
        on(ContractActions.loadContractSuccess, (state, { contract }) => contractsAdapter.setOne(contract, {
            ...state,
            selectedContract: contract,
            loading: false,
            error: null
        })),
        on(ContractActions.loadContractFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),

        // Create Contract
        on(ContractActions.createContract, (state) => ({
            ...state,
            loading: true,
            error: null,
            successCreate: false,
        })),
        on(ContractActions.createContractSuccess, (state, { contract }) => contractsAdapter.addOne(contract, {
            ...state,
            loading: false,
            error: null,
            lastUpdated: new Date().toISOString(),
            successCreate: true,
        })),
        on(ContractActions.createContractFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
            successCreate: false,
        })),

        // Update Contract
        on(ContractActions.updateContract, (state) => ({
            ...state,
            loading: true,
            error: null,
            successUpdate: false,
        })),
        on(ContractActions.updateContractSuccess, (state, { contract }) => contractsAdapter.updateOne({
            id: contract.id,
            changes: contract
        }, {
            ...state,
            selectedContract: state.selectedContract?.id === contract.id ? contract : state.selectedContract,
            loading: false,
            error: null,
            lastUpdated: new Date().toISOString(),
            successUpdate: true,
        })),
        on(ContractActions.updateContractFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
            successUpdate: false,
        })),

        // Delete Contract
        on(ContractActions.deleteContract, (state) => ({
            ...state,
            loading: true,
            error: null,
            successDelete: false,
        })),
        on(ContractActions.deleteContractSuccess, (state, { id }) => contractsAdapter.removeOne(id, {
            ...state,
            selectedContract: state.selectedContract?.id === id ? null : state.selectedContract,
            loading: false,
            error: null,
            lastUpdated: new Date().toISOString(),
            successDelete: true,
        })),
        on(ContractActions.deleteContractFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
            successDelete: false,
        })),

        // Download Contract
        on(ContractActions.downloadContract, (state) => ({
            ...state,
            downloading: true,
            error: null,
            successDownload: false,
        })),
        on(ContractActions.downloadContractSuccess, (state, { contract }) => contractsAdapter.setOne(contract, {
            ...state,
            downloading: false,
            error: null,
            successDownload: true,
        })),
        on(ContractActions.downloadContractFailure, (state, { error }) => ({
            ...state,
            downloading: false,
            error,
            successDownload: false,
        })),

        // Load Contracts By Student
        on(ContractActions.loadContractsByStudent, (state) => ({
            ...state,
            loading: true,
            error: null,
            successLoadContractsByStudent: false,
        })),
        on(ContractActions.loadContractsByStudentSuccess, (state, { contracts }) => contractsAdapter.setAll(contracts, {
            ...state,
            loading: false,
            error: null,
            lastUpdated: new Date().toISOString()
        })),
        on(ContractActions.loadContractsByStudentFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),

        // Clear actions
        on(ContractActions.clearContracts, (state) => ({
            ...state,
            contracts: contractsAdapter.removeAll(state),
            selectedContract: null,
            lastUpdated: null
        })),
        on(ContractActions.clearContractsErrors, (state) => ({
            ...state,
            error: null
        }))
    )
});
