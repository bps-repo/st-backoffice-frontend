export const LESSON_COLUMNS = [
    {field: 'title', header: 'Título'},
    {field: 'startDatetime', header: 'Data Início', customTemplate: true},
    {field: 'endDatetime', header: 'Data Fim', customTemplate: true},
    {field: 'teacherId', header: 'Professor', customTemplate: true},
    {field: 'centerId', header: 'Centro', customTemplate: true},
    {field: 'unitId', header: 'Unidade', customTemplate: true},
    {field: 'status', header: 'Status', customTemplate: true},
    {field: 'actions', header: 'Acções', customTemplate: true}];

export const LESSONS_GLOBAL_FILTER_FIELDS = [
    'name',
    'startDate',
    'endDate',
    'teacher.name',
    'center.name',
    'level.name',
    'status'
]
