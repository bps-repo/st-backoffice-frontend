import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Contract, CreateStudentContractRequest} from "../../../models/corporate/contract";

export const CONTRACT_FEATURE_KEY = 'Contract';

export const ContractActions = createActionGroup(
    {
        source: CONTRACT_FEATURE_KEY,
        events: {
            'Load Contracts': emptyProps(),
            'Load Contracts Success': props<{ contracts: Contract[] }>(),
            'Load Contracts Failure': props<{ error: any }>(),

            'Load Contract': props<{ id: string }>(),
            'Load Contract Success': props<{ contract: Contract }>(),
            'Load Contract Failure': props<{ error: any }>(),

            'Create Contract': props<{ contract: CreateStudentContractRequest }>(),
            'Create Contract Success': props<{ contract: Contract }>(),
            'Create Contract Failure': props<{ error: any }>(),

            'Update Contract': props<{ id: string, contract: Partial<Contract> }>(),
            'Update Contract Success': props<{ contract: Contract }>(),
            'Update Contract Failure': props<{ error: any }>(),

            'Delete Contract': props<{ id: string }>(),
            'Delete Contract Success': props<{ id: string }>(),
            'Delete Contract Failure': props<{ error: any }>(),

            'Load Contracts By Student': props<{ studentId: string }>(),
            'Load Contracts By Student Success': props<{ contracts: Contract[] }>(),
            'Load Contracts By Student Failure': props<{ error: any }>(),

            'Download Contract': props<{ contractId: string }>(),
            'Download Contract Success': props<{ contract: any }>(),
            'Download Contract Failure': props<{ error: any }>(),

            'Clear Contracts': emptyProps(),
            'Clear Contracts Errors': emptyProps(),
        }
    }
)
