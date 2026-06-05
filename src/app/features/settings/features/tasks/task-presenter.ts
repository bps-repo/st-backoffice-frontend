import {
    StudentStatus,
    TaskAction,
    TaskStatus,
    TaskType,
} from '../../../../core/models/task-item.model';

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
    NO_ACTIVE_CONTRACT: 'Sem contrato activo',
    LEVEL_NEEDS_ACTIVATION: 'Sem nível activado',
    INSTALLMENT_OVERDUE: 'Pagamentos vencidos',
    INSTALLMENT_DUE_SOON: 'Pagamentos a vencer',
    CONTRACT_ENDING_SOON: 'Término de contrato',
    LONG_ABSENCE: 'Ausências longas',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    OPEN: 'Aberta',
    IN_PROGRESS: 'Em progresso',
    COMPLETED: 'Concluída',
    IGNORED: 'Ignorada',
    SNOOZED: 'Adiada',
};

export const TASK_ACTION_LABELS: Record<TaskAction, string> = {
    PROCEED: 'Prosseguir',
    CREATE_CONTRACT: 'Criar contrato',
    IGNORE: 'Ignorar',
    COMPLETE: 'Concluir',
    BILLING_CALL: 'Ligação de cobrança',
    EXTEND_PAYMENT: 'Estender pagamento',
    SUSPEND: 'Suspender',
    REMIND: 'Lembrar',
    MARK_MEETING: 'Marcar reunião',
    DELETE: 'Excluir',
    PROCEED_WITH_PENDING_PAYMENT: 'Prosseguir c/ pend. pagamento',
};

export function taskStatusClass(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
        OPEN: 'bg-blue-100 text-blue-800',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
        COMPLETED: 'bg-green-100 text-green-800',
        IGNORED: 'bg-gray-100 text-gray-800',
        SNOOZED: 'bg-purple-100 text-purple-800',
    };
    return map[status] ?? '';
}

export function studentStatusClass(status: StudentStatus): string {
    const map: Partial<Record<StudentStatus, string>> = {
        ACTIVE: 'bg-green-100 text-green-800',
        INACTIVE: 'bg-gray-100 text-gray-800',
        PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
        SUSPENDED: 'bg-red-100 text-red-800',
        RENEWABLE: 'bg-blue-100 text-blue-800',
        DEBTOR: 'bg-orange-100 text-orange-800',
    };
    return map[status] ?? 'bg-gray-100 text-gray-800';
}

export function isContractTaskType(type: TaskType): boolean {
    return (['INSTALLMENT_OVERDUE', 'INSTALLMENT_DUE_SOON', 'CONTRACT_ENDING_SOON'] as TaskType[])
        .includes(type);
}

export function getDaysFromDateString(dateString: string): number {
    const today = new Date();
    const target = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
