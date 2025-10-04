import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Employee } from 'src/app/core/models/corporate/employee';

export interface EmployeesState extends EntityState<Employee> {
    loading: boolean;
    error: string | null;

    selectedId: string

    byRole: { [role: string]: string[] }; // store IDs by role
    byCenter: { [centerId: string]: string[] };
    byStatus: { [status: string]: string[] };
    searchIds: string[]; // last search (non-paginated)
    searchPage: any | null; // last paginated search page object
}

export const employeesAdapter = createEntityAdapter<Employee>({
    selectId: (e) => e.id,
});

export const employeesInitialState: EmployeesState = employeesAdapter.getInitialState({
    loading: false,
    selectedId: "",
    error: null,
    byRole: {},
    byCenter: {},
    byStatus: {},
    searchIds: [],
    searchPage: null,
});
