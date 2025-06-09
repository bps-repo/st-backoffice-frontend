import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const GLOBAL_FILTERS = ['id', 'name', 'center', 'level', 'phone', 'email', 'course', 'unit', 'classEntity', 'status', 'unitProgress']
export const COLUMNS: TableColumn[] = [
    {
        field: 'id',
        header: 'Nº',
        filterType: 'text',
    },
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
        field: 'center',
        header: 'Centro',
        filterType: 'text',
    },
    {
        field: 'course',
        header: 'Curso',
        filterType: 'text',
    },
    {
        field: 'level',
        header: 'Nível',
        filterType: 'text',
    },
    {
        field: 'unit',
        header: 'Unidade',
        filterType: 'text',
    },
    {
        field: 'classEntity',
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
        field: 'unitProgress',
        header: 'Progresso',
        filterType: 'text',
        // Mock data for unitProgress since it's not in the Student model
        filterOptions: [
            {label: 'Not Started', value: 'Not Started'},
            {label: '0-25%', value: '0-25%'},
            {label: '26-50%', value: '26-50%'},
            {label: '51-75%', value: '51-75%'},
            {label: '76-100%', value: '76-100%'}
        ]
    },
    {
        field: 'phone',
        header: 'Telefone',
        filterType: 'text',
    },
    {
        field: 'birthdate',
        header: 'Data de Nascimento',
        filterType: 'date',
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

