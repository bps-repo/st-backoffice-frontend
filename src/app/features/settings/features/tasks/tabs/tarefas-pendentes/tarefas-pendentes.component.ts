import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Task } from '../../models/task.model';
import { TASK_DATA } from 'src/app/shared/tokens/task.token';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarefas-pendentes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './tarefas-pendentes.component.html',
})
export class TarefasPendentesComponent implements OnInit {
  allTasks: Task[] = [];
  pendingTasks: Task[] = [];

  // Injetar os dados da tarefa usando o token
  taskData = inject(TASK_DATA);

  ngOnInit() {
    // Se os dados forem injetados, usá-los
    if (this.taskData) {
      this.allTasks = Array.isArray(this.taskData) ? this.taskData : [this.taskData];
      this.filterPendingTasks();
    }
  }

  filterPendingTasks() {
    this.pendingTasks = this.allTasks.filter(task => task.status === 'PENDENTE');
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
    this.filterPendingTasks();
  }
}
