import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface NotificationType {
    name: string;
    code: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputSwitchModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CardModule,
    RippleModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class ListComponent implements OnInit {
  // General Settings
  schoolName: string = 'My School';
  schoolEmail: string = 'contact@myschool.com';
  schoolPhone: string = '+1234567890';
  enableDashboard: boolean = true;
  enableReports: boolean = true;
  defaultPageSize: number = 10;

  // Notification Settings
  enableNotifications: boolean = true;
  notificationTypes: NotificationType[] = [
    { name: 'Email', code: 'email' },
    { name: 'In-App', code: 'in-app' },
    { name: 'Both', code: 'both' }
  ];
  selectedNotificationType: NotificationType = this.notificationTypes[2]; // Both by default

  // Academic Settings
  maxStudentsPerClass: number = 30;
  maxClassesPerTeacher: number = 5;
  enableAutoEnrollment: boolean = true;

  // Localization Settings
  defaultLanguage: string = 'Portuguese';
  timezone: string = 'UTC+0';
  dateFormat: string = 'dd/mm/yyyy';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    // In a real application, these settings would be loaded from a service
  }

  saveSettings(): void {
    // In a real application, this would save the settings to a backend service
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Configurações salvas com sucesso!'
    });
  }

  resetSettings(): void {
    // Reset to default values
    this.schoolName = 'My School';
    this.schoolEmail = 'contact@myschool.com';
    this.schoolPhone = '+1234567890';
    this.enableDashboard = true;
    this.enableReports = true;
    this.defaultPageSize = 10;
    this.enableNotifications = true;
    this.selectedNotificationType = this.notificationTypes[2];
    this.maxStudentsPerClass = 30;
    this.maxClassesPerTeacher = 5;
    this.enableAutoEnrollment = true;
    this.defaultLanguage = 'Portuguese';
    this.timezone = 'UTC+0';
    this.dateFormat = 'dd/mm/yyyy';

    this.messageService.add({
      severity: 'info',
      summary: 'Redefinir',
      detail: 'Configurações redefinidas para os valores padrão.'
    });
  }
}
