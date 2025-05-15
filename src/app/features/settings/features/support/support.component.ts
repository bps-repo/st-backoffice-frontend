import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface Ticket {
  title: string;
  message: string;
  status: 'ABERTO' | 'ANDAMENTO' | 'RESOLVIDO';
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    TableModule,
    TagModule
  ],
  templateUrl: './support.component.html',
})
export class SupportComponent {
  supportForm = this.fb.group({
    title: ['', Validators.required],
    message: ['', Validators.required]
  });

  tickets: Ticket[] = [
    {
      title: 'Erro no cadastro de alunos',
      message: 'Não estou conseguindo cadastrar novos alunos.',
      status: 'ABERTO',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Problema no login de professores',
      message: 'Alguns professores relatam falha ao acessar.',
      status: 'ANDAMENTO',
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      updatedAt: new Date()
    },
    {
      title: 'Atualização nos relatórios',
      message: 'Os relatórios de desempenho foram atualizados.',
      status: 'RESOLVIDO',
      createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 1))
    }
  ];

  constructor(private fb: FormBuilder) {}

  enviarSolicitacao() {
    if (this.supportForm.valid) {
      const newTicket: Ticket = {
        title: this.supportForm.value.title as string,
        message: this.supportForm.value.message as string,
        status: 'ABERTO',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.tickets.unshift(newTicket);
      this.supportForm.reset();
    }
  }

  getStatusColor(status: string): string {
    return {
      'ABERTO': 'warning',
      'ANDAMENTO': 'info',
      'RESOLVIDO': 'success'
    }[status] || 'default';
  }
}
