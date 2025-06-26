import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const CENTER_COLUMNS: TableColumn[] = [
    {
        field: 'name',
        header: 'Nome',
        filterType: 'text',
    },
    {
        field: 'email',
        header: 'Email',
        filterType: 'text',
    },
    {
        field: 'address',
        header: 'Endereço',
        filterType: 'text',
    },
    {
        field: 'phone',
        header: 'Telefone',
        filterType: 'text',
    },
    {
        field: 'active',
        header: 'Estado',
        filterType: 'boolean',
        customTemplate: true,
    },
    {
        field: 'actions',
        header: 'Ações',
        customTemplate: true,
    },
];
