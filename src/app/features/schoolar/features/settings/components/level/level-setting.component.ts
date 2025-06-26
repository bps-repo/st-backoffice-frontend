// general.component.ts
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
    selector: 'app-settings-general',
    templateUrl: './level-setting.component.html',
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
export class LevelSettingComponent implements OnInit {
    // student Settings
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

    // Course Module Settings
    maxUnitsPerLevel: number = 10;
    maxLessonsPerUnit: number = 20;
    enableAutoProgress: boolean = true;

    // Chart Settings
    enableCharts: boolean = true;
    chartHeight: number = 300;

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
        this.enableDashboard = true;
        this.enableReports = true;
        this.defaultPageSize = 10;
        this.enableNotifications = true;
        this.selectedNotificationType = this.notificationTypes[2];
        this.maxUnitsPerLevel = 10;
        this.maxLessonsPerUnit = 20;
        this.enableAutoProgress = true;
        this.enableCharts = true;
        this.chartHeight = 300;

        this.messageService.add({
            severity: 'info',
            summary: 'Redefinir',
            detail: 'Configurações redefinidas para os valores padrão.'
        });
    }
}
