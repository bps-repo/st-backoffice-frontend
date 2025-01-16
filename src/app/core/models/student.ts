export interface Student {
    id?: number;
    name: string;
    center: string;
    course: string;
    level: string;
    phone: number;
    email: string;
    birthdate: string;
    status?: StudentStatus;
}

export enum StudentStatus {
    ACTIVE = 'activo',
    INACTIVE = 'inactivo',
    WARNING = 'atenção',
    REMOVED = 'excluído',
    PLUNKED = 'reprovado',
    PENDING = 'pendente',
    FINISHED = 'finalizado',
    QUIT = 'desistente',
    TRANSFERED = 'transferido',
    CANCELED = 'cancelado',
    SUSPENDED = 'suspenso',
}
