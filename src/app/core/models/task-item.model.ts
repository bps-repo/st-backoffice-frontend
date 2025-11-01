export interface InstallmentItem {
  dueDate: string;
  number: number;
  contractId: string;
  amount: number;
  id: string;
  status: string;
}

export interface LevelItem {
  id: string;
  name: string;
}

export interface TaskItem {
  studentId: string;
  studentCode: number;
  studentName: string;
  status: string;
  level: string | LevelItem | null;
  center: {
    id: string;
    name: string;
  };
  taskType: string;
  description: string;
  actions: string[];
  installments?: InstallmentItem[];
}

