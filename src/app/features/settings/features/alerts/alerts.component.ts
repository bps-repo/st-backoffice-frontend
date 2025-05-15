import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';

interface Alert {
  type: string;
  title: string;
  description: string;
  date: Date;
  read: boolean;
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    CalendarModule
  ],
  templateUrl: './alerts.component.html',
})
export class AlertsComponent {
  alertForm = this.fb.group({
    type: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required]
  });

  alertTypes = ['INFO', 'WARNING', 'ERROR', 'SUCCESS'];

  alerts: Alert[] = [
    {
      type: 'INFO',
      title: 'Novo Curso Adicionado',
      description: 'O curso de Angular avançado foi publicado.',
      date: new Date(),
      read: false
    },
    {
      type: 'ERROR',
      title: 'Falha no Pagamento',
      description: 'Pagamento do usuário johndoe não foi processado.',
      date: new Date(),
      read: false
    }
  ];

  constructor(private fb: FormBuilder) {}

  addAlert() {
    if (this.alertForm.valid) {
      this.alerts.unshift({
        ...this.alertForm.value,
        date: new Date(),
        read: false
      } as Alert);
      this.alertForm.reset();
    }
  }

  markAsRead(alert: Alert) {
    alert.read = true;
  }

  getIcon(type: string): string {
    return {
      INFO: 'pi pi-info-circle',
      WARNING: 'pi pi-exclamation-triangle',
      ERROR: 'pi pi-times-circle',
      SUCCESS: 'pi pi-check-circle'
    }[type] || 'pi pi-bell';
  }

  getColor(type: string): string {
    return {
      INFO: 'text-blue-500',
      WARNING: 'text-orange-500',
      ERROR: 'text-red-500',
      SUCCESS: 'text-green-500'
    }[type] || 'text-500';
  }
}
