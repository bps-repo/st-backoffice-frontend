import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const GLOBAL_FILTERS = ['id', 'code', 'center', 'level', 'phone', 'email', 'course', 'unit', 'classEntity', 'status', 'dateOfBirth'];
export const COLUMNS: TableColumn[] = [
    {
        field: 'code',
        header: 'ID',
        filterType: 'numeric',
    },
    {
        field: 'name',
        header: 'Nome',
        filterType: 'text',
        customTemplate: true,
    },
    {
        field: 'email',
        header: 'Email',
        filterType: 'text',
        customTemplate: true,
    },
    {
        field: 'centerId',
        header: 'Centro',
        filterType: 'text',
    },
    {
        field: 'levelId',
        header: 'Nível',
        filterType: 'text',
    },
    {
        field: 'classEntityId',
        header: 'Turma',
        filterType: 'text',
    },
    {
        field: 'status',
        header: 'Status',
        filterType: 'text',
        // Mock data for status since it's not in the Student model
        filterOptions: [
            {label: 'Active', value: 'Active'},
            {label: 'Inactive', value: 'Inactive'},
            {label: 'Graduated', value: 'Graduated'},
            {label: 'On Leave', value: 'On Leave'}
        ]
    },
    {
        field: 'dateOfBirth',
        header: 'Data de Nascimento',
        filterType: 'date',
        customTemplate: true,
    },
];

export const HEADER_ACTIONS = [
    {
        label: 'Exportar para Excel',
        icon: 'pi pi-file-excel',
        command: () => null,
    },
    {
        label: 'Exportar para PDF',
        icon: 'pi pi-file-pdf',
        command: () => null,
    },
];

