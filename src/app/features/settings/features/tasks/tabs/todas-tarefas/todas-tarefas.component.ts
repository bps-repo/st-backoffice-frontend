import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Task } from '../../models/task.model';
import { TASK_DATA } from 'src/app/shared/tokens/task.token';

@Component({
  selector: 'app-todas-tarefas',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './todas-tarefas.component.html',
})
export class TodasTarefasComponent implements OnInit {
  tasks: Task[] = [];
  
  // Injetar os dados da tarefa usando o token
  taskData = inject(TASK_DATA);

  ngOnInit() {
    // Se os dados forem injetados, usá-los
    if (this.taskData) {
      this.tasks = Array.isArray(this.taskData) ? this.taskData : [this.taskData];
    }
  }

  getStatusColor(status: string): string {
    return {
      'PENDENTE': 'warning',
      'EM_ANDAMENTO': 'info',
      'CONCLUIDA': 'success'
    }[status] || 'default';
  }

  getPriorityColor(priority: string): string {
    return {
      'BAIXA': 'success',
      'MEDIA': 'warning',
      'ALTA': 'danger'
    }[priority] || 'default';
  }

  isTaskOverdue(dueDate: Date): boolean {
    return new Date() > new Date(dueDate);
  }

  atualizarStatus(task: Task, newStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA') {
    task.status = newStatus;
    task.updatedAt = new Date();
  }
}