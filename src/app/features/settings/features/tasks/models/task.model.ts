export interface Task {
  id?: string;
  title: string;
  description: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  category?: string;
}
