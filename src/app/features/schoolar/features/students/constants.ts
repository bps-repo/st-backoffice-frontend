import { TableColumn } from "../../../../shared/components/tables/global-table/global-table.component";
import { Kpi } from "../../../../shared/kpi-indicator/kpi-indicator.component";
import { StudentDashboardStatistics } from 'src/app/core/models/academic/students/student-dashboard-statistics';

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
        sortable: true,
        sortField: 'level.name',
    },
    {
        field: 'vip',
        header: 'Tipo',
        filterType: 'text',
        customTemplate: true,
        sortable: true,
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
        sortable: true,
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

export function buildStudentListKpis(stats: StudentDashboardStatistics | null): Kpi[] {
    return [
        {
            label: 'Total de Alunos',
            value: stats?.totalStudents ?? 0,
            icon: { label: 'users', color: 'text-blue-500', type: 'mat' },
        },
        {
            label: 'Ativos',
            value: stats?.studentsByStatus?.['ACTIVE'] ?? 0,
            icon: { label: 'user-check', color: 'text-green-500', type: 'mat' },
        },
        {
            label: 'Inativos',
            value: stats?.studentsByStatus?.['INACTIVE'] ?? 0,
            icon: { label: 'user-cancel', color: 'text-red-500', type: 'mat' },
        },
        {
            label: 'Masculino',
            value: stats?.studentsByGender?.['MALE'] ?? 0,
            icon: { label: 'users', color: 'text-cyan-500', type: 'mat' },
        },
        {
            label: 'Feminino',
            value: stats?.studentsByGender?.['FEMALE'] ?? 0,
            icon: { label: 'users', color: 'text-pink-500', type: 'mat' },
        },
        {
            label: 'VIP',
            value: stats?.studentsByType?.['VIP'] ?? 0,
            icon: { label: 'graduation-cap', color: 'text-purple-500' },
        },
        {
            label: 'Standard',
            value: stats?.studentsByType?.['STANDARD'] ?? 0,
            icon: { label: 'calendar', color: 'text-secondary' },
        },
    ];
}


