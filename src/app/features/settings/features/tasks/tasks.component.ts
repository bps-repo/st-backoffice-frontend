import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewComponent } from 'src/app/shared/components/tab-view/tab-view.component';
import { TASK_TABS } from './tabs/task-tabs';
import { Task } from './models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    TabViewComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tabs = TASK_TABS;
  tasks: Task[] = [];

  ngOnInit() {
    // Inicializar com algumas tarefas de exemplo
    this.tasks = [
      {
        id: '1',
        title: 'Revisar documentação',
        description: 'Revisar a documentação do projeto e atualizar conforme necessário',
        status: 'PENDENTE',
        priority: 'ALTA',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: 'João Silva',
        category: 'Documentação'
      },
      {
        id: '2',
        title: 'Implementar nova funcionalidade',
        description: 'Desenvolver o módulo de relatórios conforme especificação',
        status: 'EM_ANDAMENTO',
        priority: 'MEDIA',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
        updatedAt: new Date(),
        assignedTo: 'Maria Santos',
        category: 'Desenvolvimento'
      },
      {
        id: '3',
        title: 'Corrigir bug no login',
        description: 'Resolver problema de autenticação relatado pelos usuários',
        status: 'CONCLUIDA',
        priority: 'ALTA',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        assignedTo: 'Carlos Oliveira',
        category: 'Correção de Bugs'
      },
      {
        id: '4',
        title: 'Atualizar bibliotecas',
        description: 'Atualizar as dependências do projeto para as versões mais recentes',
        status: 'PENDENTE',
        priority: 'BAIXA',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: 'Ana Pereira',
        category: 'Manutenção'
      }
    ];
  }
}
