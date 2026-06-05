export type StudentStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING_PAYMENT'
  | 'RENEWABLE'
  | 'RENEWABLE_MEETING'
  | 'EXTENDED_PAYMENT'
  | 'EXTENDED_PENDING_PAYMENT'
  | 'DEBTOR'
  | 'UNMARKABLE'
  | 'CANCELLED'
  | 'QUIT'
  | 'ENROLLED';

export type TaskType =
  | 'NO_ACTIVE_CONTRACT'
  | 'LEVEL_NEEDS_ACTIVATION'
  | 'INSTALLMENT_OVERDUE'
  | 'INSTALLMENT_DUE_SOON'
  | 'CONTRACT_ENDING_SOON'
  | 'LONG_ABSENCE';

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'IGNORED' | 'SNOOZED';

export type TaskAction =
  | 'PROCEED'
  | 'CREATE_CONTRACT'
  | 'IGNORE'
  | 'COMPLETE'
  | 'BILLING_CALL'
  | 'EXTEND_PAYMENT'
  | 'SUSPEND'
  | 'REMIND'
  | 'MARK_MEETING'
  | 'DELETE'
  | 'PROCEED_WITH_PENDING_PAYMENT';

export type ContractStatus =
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'OVERDUE'
  | 'PENDING_PAYMENT'
  | 'EXTENDED_PAYMENT'
  | 'HOLD';

export interface TaskContract {
  id: string;
  endDate: string;
  status: ContractStatus;
}

export interface TaskItem {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  studentStatus: StudentStatus;
  level: { id: string; name: string };
  center: { id: string; name: string };
  taskType: TaskType;
  description: string;
  taskStatus: TaskStatus;
  availableActions: TaskAction[];
  lastAction: TaskAction | null;
  generatedDate: string;
  resolvedDate: string | null;
  contract: TaskContract | null;
}
