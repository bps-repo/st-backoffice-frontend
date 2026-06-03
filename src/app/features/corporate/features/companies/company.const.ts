import {TableColumn} from '../../../../shared/components/tables/global-table/global-table.component';

export const COMPANY_COLUMNS: TableColumn[] = [
    {
        field: 'name',
        header: 'Nome',
        filterType: 'text',
    },
    {
        field: 'contactEmail',
        header: 'Email de Contacto',
        filterType: 'text',
    },
    {
        field: 'contactPhone',
        header: 'Telefone',
        filterType: 'text',
    },
    {
        field: 'registrationNumber',
        header: 'Nº de Registo',
        filterType: 'text',
    },
    {
        field: 'actions',
        header: 'Ações',
        customTemplate: true,
    },
];
