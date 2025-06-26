import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const CLASSES_COLUMNS: TableColumn[] = [
    {
        field: 'code',
        header: 'Code',
        filterType: 'text',
    },
    {
        field: 'name',
        header: 'Name',
        filterType: 'text',
    },
    {
        field: 'levelId',
        header: 'Nível',
        filterType: 'text',
        customTemplate: true
    },
    {
        field: 'centerId',
        header: 'Centro',
        filterType: 'text',
        customTemplate: true
    },
    {
        field: 'maxCapacity',
        header: 'Capacidade',
        filterType: 'numeric',
    },
    {
        field: 'status',
        header: 'Status',
        filterType: 'text',
        customTemplate: true
    }
];

export const GLOBAL_CLASSES_FILTERS = []
