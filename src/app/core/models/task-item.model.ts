export interface TaskItem {
  studentId: string;
  studentCode: number;
  studentName: string;
  status: string;
  level: string | null;
  center: {
    id: string;
    name: string;
  };
  taskType: string;
  description: string;
  actions: string[];
}

