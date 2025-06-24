import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const CLASSES_COLUMNS: TableColumn[] = [
    {
        field: 'id',
        header: 'ID',
        filterType: 'text',
    },
    {
        field: 'name',
        header: 'Name',
        filterType: 'text',
    },
    {
        field: 'code',
        header: 'Code',
        filterType: 'text',
    },
    {
        field: 'level',
        header: 'Level',
        filterType: 'text',
    },
    {
        field: 'teacher',
        header: 'Teacher',
        filterType: 'text',
    },
    {
        field: 'schedule',
        header: 'Schedule',
        filterType: 'text',
    },
    {
        field: 'enrolled',
        header: 'Enrolled',
        filterType: 'numeric',
    },
    {
        field: 'capacity',
        header: 'Capacity',
        filterType: 'numeric',
    },
    {
        field: 'status',
        header: 'Status',
        filterType: 'text',
    }
];

export const GLOBAL_CLASSES_FILTERS = []
