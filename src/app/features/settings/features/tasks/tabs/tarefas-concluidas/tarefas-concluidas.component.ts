import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Task } from '../../models/task.model';
import { TASK_DATA } from 'src/app/shared/tokens/task.token';

@Component({
  selector: 'app-tarefas-concluidas',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './tarefas-concluidas.component.html',
})
export class TarefasConcluidasComponent implements OnInit {
  allTasks: Task[] = [];
  completedTasks: Task[] = [];
  
  // Injetar os dados da tarefa usando o token
  taskData = inject(TASK_DATA);

  ngOnInit() {
    // Se os dados forem injetados, usá-los
    if (this.taskData) {
      this.allTasks = Array.isArray(this.taskData) ? this.taskData : [this.taskData];
      this.filterCompletedTasks();
    }
  }

  filterCompletedTasks() {
    this.completedTasks = this.allTasks.filter(task => task.status === 'CONCLUIDA');
  }

  getPriorityColor(priority: string): string {
    return {
      'BAIXA': 'success',
      'MEDIA': 'warning',
      'ALTA': 'danger'
    }[priority] || 'default';
  }

  atualizarStatus(task: Task, newStatus: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA') {
    task.status = newStatus;
    task.updatedAt = new Date();
    this.filterCompletedTasks();
  }
}