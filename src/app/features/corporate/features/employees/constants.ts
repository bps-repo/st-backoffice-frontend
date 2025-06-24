import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const GLOBAL_FILTERS = ['id', 'code', 'name', 'email', 'department', 'position', 'status', 'hireDate'];
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
        field: 'department',
        header: 'Departamento',
        filterType: 'text',
    },
    {
        field: 'position',
        header: 'Cargo',
        filterType: 'text',
    },
    {
        field: 'status',
        header: 'Status',
        filterType: 'text',
        filterOptions: [
            {label: 'Ativo', value: 'ACTIVE'},
            {label: 'Inativo', value: 'INACTIVE'},
            {label: 'De Licença', value: 'ON_LEAVE'},
            {label: 'Terminado', value: 'TERMINATED'}
        ]
    },
    {
        field: 'hireDate',
        header: 'Data de Contratação',
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
