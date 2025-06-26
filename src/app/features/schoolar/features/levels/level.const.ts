import {TableColumn} from "../../../../shared/components/tables/global-table/global-table.component";

export const LEVEL_COLUMNS: TableColumn[] = [
    {
        field: 'id',
        header: 'ID',
        filterType: 'text',
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
        field: 'duration',
        header: 'Duração',
        filterType: 'numeric',
    },
    {
        field: 'maximumUnits',
        header: 'Unidades Máximas',
        filterType: 'numeric',
    },
    {
        field: 'actions',
        header: 'Ações',
        customTemplate: true,
    },
];
