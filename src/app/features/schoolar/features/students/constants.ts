import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";
import {Kpi} from "../../../../shared/kpi-indicator/kpi-indicator.component";

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

export const KPI: Kpi[] = [
    {
        label: 'Total de Alunos',
        value: 4,
        icon: {label: 'users', color: 'text-blue-500', type:'mat'},
    },
    {
        label: 'Ativos',
        value: 3,
        icon: {label: 'pi pi-check', color: 'text-green-500'},
    },
    {
        label: 'Inativos',
        value: 1,
        icon: {label: 'pi pi-times', color: 'text-red-500'},
    },
    {
        label: 'Em renovação',
        value: 0,
        icon: {label: 'pi pi-exclamation-circle', color: 'text-orange-500'},
    },
    {
        label: 'VIP',
        value: 2,
        icon: {label: 'pi pi-file', color: 'text-purple-500'},
    },
    {
        label: 'Standard',
        value: 1,
        icon: {label: 'pi pi-calendar', color: 'text-secondary'},
    }
]


