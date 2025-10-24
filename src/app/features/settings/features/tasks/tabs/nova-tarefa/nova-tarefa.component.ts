import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { Task } from '../../models/task.model';
import { TASK_DATA } from 'src/app/shared/tokens/task.token';

@Component({
  selector: 'app-nova-tarefa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    ButtonModule
  ],
  templateUrl: './nova-tarefa.component.html',
})
export class NovaTarefaComponent implements OnInit {
  taskForm!: FormGroup;
  tasks: Task[] = [];
  
  // Opções para os dropdowns
  statusOptions = [
    { label: 'Pendente', value: 'PENDENTE' },
    { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
    { label: 'Concluída', value: 'CONCLUIDA' }
  ];
  
  priorityOptions = [
    { label: 'Baixa', value: 'BAIXA' },
    { label: 'Média', value: 'MEDIA' },
    { label: 'Alta', value: 'ALTA' }
  ];
  
  // Injetar FormBuilder
  private fb = inject(FormBuilder);
  
  // Injetar os dados da tarefa usando o token
  taskData = inject(TASK_DATA);

  ngOnInit() {
    // Inicializar o formulário
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      priority: ['MEDIA', [Validators.required]],
      dueDate: [null, [Validators.required]],
      assignedTo: [''],
      category: [''],
    });
    
    // Se os dados forem injetados, usá-los
    if (this.taskData) {
      this.tasks = Array.isArray(this.taskData) ? this.taskData : [this.taskData];
    }
  }

  adicionarTarefa() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: Date.now().toString(), // Gerar um ID único baseado no timestamp
        ...this.taskForm.value,
        status: 'PENDENTE', // Status inicial sempre pendente
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.tasks.push(newTask);
      this.taskForm.reset({
        priority: 'MEDIA' // Resetar com o valor padrão para prioridade
      });
    } else {
      // Marcar todos os campos como touched para mostrar validações
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}