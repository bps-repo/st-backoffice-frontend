export const LESSON_COLUMNS = [
    { field: 'title', header: 'Aula' },
    { field: 'online', header: 'Tipo', customTemplate: true },
    { field: 'startDatetime', header: 'Hora/Data', customTemplate: true },
    { field: 'teacherId', header: 'Professor' },
    { field: 'centerId', header: 'Centro' },
    { field: 'unitId', header: 'Unidade' },
    { field: 'status', header: 'Status', customTemplate: true },
    { field: 'actions', header: 'Acções' },
];

export const LESSONS_GLOBAL_FILTER_FIELDS = [
    'name',
    'startDate',
    'endDate',
    'teacher.name',
    'center.name',
    'level.name',
    'status'
]
