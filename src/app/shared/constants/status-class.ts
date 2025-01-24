import { StudentStatus } from 'src/app/core/models/student';

export const STATUS_CLASSES = new Map<any, string>([
    ['presente', 'bg-green-500'],
    ['ausente', 'bg-red-500'],
    ['warning', 'bg-yellow-400'],
    ['active', 'bg-green-500'],
    ['inactive', 'bg-red-500'],
    ['warning', 'bg-yellow-400'],
    ['finished', 'bg-blue-400'],
    ['ongoing', 'bg-green-400'],
    [StudentStatus.ACTIVE, 'bg-green-500'],
    [StudentStatus.INACTIVE, 'bg-red-500'],
    [StudentStatus.WARNING, 'bg-yellow-400'],
    [StudentStatus.REMOVED, 'bg-gray-500'],
    [StudentStatus.PLUNKED, 'bg-red-500'],
    [StudentStatus.PENDING, 'bg-blue-500'],
    [StudentStatus.FINISHED, 'bg-green-500'],
    [StudentStatus.SUSPENDED, 'bg-red-800'],
    [StudentStatus.QUIT, 'bg-red-400'],
]);

export const STATUS_COURSES = new Map<any, string>([
    [StudentStatus.ACTIVE, 'bg-green-500'],
    [StudentStatus.INACTIVE, 'bg-red-500'],
    [StudentStatus.WARNING, 'bg-yellow-400'],
    [StudentStatus.REMOVED, 'bg-gray-500'],
    [StudentStatus.PLUNKED, 'bg-red-500'],
    [StudentStatus.PENDING, 'bg-blue-500'],
]);
