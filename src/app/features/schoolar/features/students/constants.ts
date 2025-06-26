import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const GLOBAL_FILTERS = ['id', 'name', 'code', 'center', 'level', 'phone', 'email', 'course', 'unit', 'classEntity', 'status', 'dateOfBirth'];
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
        field: 'phone',
        header: 'Telefone',
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
        customTemplate: true,
    },
    {
        field: 'levelId',
        header: 'Nível',
        filterType: 'text',
        customTemplate: true,
    },
    {
        field: 'studentClass',
        header: 'Turma',
        filterType: 'text',
        customTemplate: true,
    },

    {
        field: 'dateOfBirth',
        header: 'Data de Nascimento',
        filterType: 'date',
        customTemplate: true,
    },
    {
        field: 'status',
        header: 'Status',
        filterType: 'custom',
        customTemplate: true,
    },
    {
        field: 'actions',
        header: 'Ações',
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

