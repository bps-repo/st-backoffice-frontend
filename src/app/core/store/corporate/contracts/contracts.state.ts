import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Contract} from "../../../models/corporate/contract";

export interface ContractState extends EntityState<Contract> {
    selectedContract: Contract | null;
    loading: boolean;

    downloading: boolean;
    error: any;
    errorCreate: any;
    errorDelete: any;
    errorUpdate: any;
    loadingCreate: boolean;
    loadingDelete: boolean;
    loadingUpdate: boolean;
    lastUpdated: string | null;
}

export const contractsAdapter = createEntityAdapter<Contract>();

export const initialContractState: ContractState = contractsAdapter.getInitialState({
    selectedContract: null,
    loading: false,
    error: null,

    downloading: false,
    lastUpdated: null,
    errorCreate: null,
    errorDelete: null,
    errorUpdate: null,
    loadingCreate: false,
    loadingDelete: false,
    loadingUpdate: false,
});
