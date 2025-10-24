import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const GLOBAL_FILTERS = ['id', 'code', 'name', 'email', 'department', 'position', 'status'];
export const COLUMNS: TableColumn[] = [
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
        field: 'position',
        header: 'Cargo',
        filterType: 'text',
        customTemplate: true,
    },
    {
        field: 'status',
        header: 'Status',
        filterType: 'custom',
        filterTemplate: true,
        filterOptions: [
            {label: 'Ativo', value: 'ACTIVE'},
            {label: 'Inativo', value: 'INACTIVE'},
            {label: 'De Licença', value: 'ON_LEAVE'},
            {label: 'Terminado', value: 'TERMINATED'}
        ],
        customTemplate: true,
    }
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
