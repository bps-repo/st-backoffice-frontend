export const LESSON_COLUMNS = [
    { field: 'title', header: 'Aula', sortable: true },
    { field: 'online', header: 'Tipo', customTemplate: true },
    { field: 'startDatetime', header: 'Hora/Data', customTemplate: true, sortable: true },
    { field: 'teacher', header: 'Professor', customTemplate: true },
    { field: 'center', header: 'Centro', customTemplate: true },
    { field: 'unit', header: 'Unidade', customTemplate: true },
    { field: 'status', header: 'Status', customTemplate: true, sortable: true },
    { field: 'actions', header: 'Acções', customTemplate: true },
];

export const LESSONS_GLOBAL_FILTER_FIELDS = [
    'name',
    'startDate',
    'endDate',
    'teacher.name',
    'center.name',
    'unit.name',
    'status'
]
