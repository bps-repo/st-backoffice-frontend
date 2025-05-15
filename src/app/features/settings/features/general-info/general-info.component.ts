import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule, TagModule],
  templateUrl: './general-info.component.html',
})
export class GeneralInfoComponent implements OnInit {
  kpis = [
    { label: 'Alunos Ativos', value: 1240 },
    { label: 'Professores', value: 84 },
    { label: 'Cursos', value: 36 },
    { label: 'Centros de Ensino', value: 4 }
  ];

  notices = [
    {
      title: 'Matrículas Abertas',
      message: 'O período de matrículas para o próximo semestre vai até 15 de junho.',
      status: 'ATIVO'
    },
    {
      title: 'Manutenção Programada',
      message: 'O sistema estará indisponível no dia 20 de maio das 00h às 06h.',
      status: 'IMPORTANTE'
    }
  ];

  contacts = [
    { role: 'Suporte Técnico', email: 'suporte@standrews.school', phone: '(11) 4002-8922' },
    { role: 'Secretaria Acadêmica', email: 'secretaria@standrews.school', phone: '(11) 3222-7788' }
  ];

  constructor() {}

  ngOnInit(): void {}
}
