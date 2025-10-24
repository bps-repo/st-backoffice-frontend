import { Tab } from 'src/app/shared/models/tab';
import { TASK_DATA } from 'src/app/shared/tokens/task.token';
import { NovaTarefaComponent } from './nova-tarefa/nova-tarefa.component';
import { TarefasConcluidasComponent } from './tarefas-concluidas/tarefas-concluidas.component';
import { TarefasEmAndamentoComponent } from './tarefas-em-andamento/tarefas-em-andamento.component';
import { TarefasPendentesComponent } from './tarefas-pendentes/tarefas-pendentes.component';
import { TodasTarefasComponent } from './todas-tarefas/todas-tarefas.component';

export const TASK_TABS: Tab[] = [
  {
    header: 'Nova Tarefa',
    icon: 'pi pi-plus',
    title: 'Adicionar Nova Tarefa',
    description: 'Crie uma nova tarefa para acompanhamento',
    template: NovaTarefaComponent,
    data: {
      token: TASK_DATA
    }
  },
  {
    header: 'Todas as Tarefas',
    icon: 'pi pi-list',
    title: 'Todas as Tarefas',
    description: 'Visualize e gerencie todas as tarefas',
    template: TodasTarefasComponent,
    data: {
      token: TASK_DATA
    }
  },
  {
    header: 'Pendentes',
    icon: 'pi pi-clock',
    title: 'Tarefas Pendentes',
    description: 'Visualize e gerencie tarefas pendentes',
    template: TarefasPendentesComponent,
    data: {
      token: TASK_DATA
    }
  },
  {
    header: 'Em Andamento',
    icon: 'pi pi-sync',
    title: 'Tarefas em Andamento',
    description: 'Visualize e gerencie tarefas em andamento',
    template: TarefasEmAndamentoComponent,
    data: {
      token: TASK_DATA
    }
  },
  {
    header: 'Concluídas',
    icon: 'pi pi-check-circle',
    title: 'Tarefas Concluídas',
    description: 'Visualize tarefas concluídas',
    template: TarefasConcluidasComponent,
    data: {
      token: TASK_DATA
    }
  }
];