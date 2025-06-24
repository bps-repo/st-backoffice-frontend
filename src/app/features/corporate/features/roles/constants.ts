import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const GLOBAL_FILTERS = ['id', 'name', 'description'];
export const COLUMNS: TableColumn[] = [
    {
        field: 'id',
        header: 'ID',
        filterType: 'numeric',
    },
    {
        field: 'name',
        header: 'Nome',
        filterType: 'text',
    },
    {
        field: 'description',
        header: 'Descrição',
        filterType: 'text',
    },
    {
        field: 'permissions',
        header: 'Permissões',
        filterType: 'text',
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
