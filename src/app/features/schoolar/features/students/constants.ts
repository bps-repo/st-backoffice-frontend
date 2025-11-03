import { TableColumn } from "../../../../shared/components/tables/global-table/global-table.component";
import { Kpi } from "../../../../shared/kpi-indicator/kpi-indicator.component";

export const GLOBAL_FILTERS = ['id', 'name', 'code', 'center', 'level', 'phone', 'email', 'course', 'unit', 'classEntity', 'status', 'dateOfBirth'];
export const COLUMNS: TableColumn[] = [
    /* {
         field: 'code',
         header: 'ID',
         filterType: 'numeric',
     },*/
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
        field: 'phone',
        header: 'Telefone',
        filterType: 'text',
        customTemplate: true,
    },
    {
        field: 'levelId',
        header: 'Nível',
        filterType: 'custom',
        filterTemplate: true,
        filterOptions: {
            matchMode: 'equals'
        },
        customTemplate: true,
    },
    {
        field: 'vip',
        header: 'Tipo',
        filterType: 'text',
        customTemplate: true,
    },
    {
        field: 'centerId',
        header: 'Centro',
        filterType: 'custom',
        filterTemplate: true,
        filterOptions: {
            matchMode: 'equals'
        },
        customTemplate: true,
    },
    {
        field: 'status',
        header: 'Status',
        filterType: 'custom',
        filterTemplate: true,
        filterOptions: {
            matchMode: 'equals'
        },
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

export const KPI: Kpi[] = [
    {
        label: 'Total de Alunos',
        value: 4,
        icon: { label: 'users', color: 'text-blue-500', type: 'mat' },
    },
    {
        label: 'Ativos',
        value: 3,
        icon: { label: 'user-check', color: 'text-green-500', type: 'mat' },
    },
    {
        label: 'Inativos',
        value: 1,
        icon: { label: 'user-cancel', color: 'text-red-500', type: 'mat' },
    },
    {
        label: 'Em renovação',
        value: 0,
        icon: { label: 'exclamation-circle', color: 'text-orange-500' },
    },
    {
        label: 'VIP',
        value: 2,
        icon: { label: 'graduation-cap', color: 'text-purple-500' },
    },
    {
        label: 'Standard',
        value: 1,
        icon: { label: 'calendar', color: 'text-secondary' },
    }
]


