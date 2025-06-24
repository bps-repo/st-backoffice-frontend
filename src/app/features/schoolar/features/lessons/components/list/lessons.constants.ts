export const LESSON_COLUMNS = [
    {field: 'title', header: 'Título'},
    {field: 'startDatetime', header: 'Data Início', customTemplate: true},
    {field: 'endDatetime', header: 'Data Fim', customTemplate: true},
    {field: 'teacherId', header: 'Professor'},
    {field: 'centerId', header: 'Centro'},
    {field: 'unitId', header: 'Unidade'},
    {field: 'status', header: 'Status'},
    {field: 'actions', header: 'Acções'},
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
