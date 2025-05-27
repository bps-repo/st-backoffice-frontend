import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { PieChartComponent } from 'src/app/shared/components/charts/pie-chart/pie-chart.component';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-general',
    imports: [
        InputTextModule,
        CommonModule,
        ChartModule,
        CardModule,
        AvatarModule,
        BadgeModule,
        DividerModule,
        TagModule,
        ButtonModule,
        RippleModule,
        ProgressBarModule,
        TimelineModule,
        TableModule
    ],
    templateUrl: './general.component.html'
})
export class GeneralComponent implements OnInit {
    // Make Math available in the template
    Math = Math;

    // Student information
    studentInfo: any;

    // Academic progress
    unitProgress: number = 75;
    levelProgress: number = 45;

    // Scheduled lessons
    upcomingLessons: any[] = [];

    // Personal information
    personalInfo: any[] = [];

    // Notifications
    notifications: any[] = [];

    ngOnInit(): void {
        // Mock student data - in a real app, this would come from a service
        this.studentInfo = {
            id: '1000',
            name: 'Manuel Ikuma',
            email: 'user273@gmail.com',
            center: 'Centro de Línguas - Talatona',
            course: 'English Language',
            level: 'Intermediate 2',
            unit: 'Unit 3: Business Communication',
            unitOrder: 3,
            totalUnits: 4,
            phone: '933449392',
            status: 'Active',
            enrollmentDate: '2023-01-15',
            photo: 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg'
        };

        // Mock upcoming lessons
        this.upcomingLessons = [
            {
                id: 'L1001',
                date: '2023-10-25',
                time: '10:00 - 11:30',
                title: 'Business Communication - Speaking Practice',
                teacher: 'Sarah Johnson',
                location: 'Room 203'
            },
            {
                id: 'L1002',
                date: '2023-10-27',
                time: '10:00 - 11:30',
                title: 'Business Communication - Listening Comprehension',
                teacher: 'Sarah Johnson',
                location: 'Room 203'
            },
            {
                id: 'L1003',
                date: '2023-10-30',
                time: '10:00 - 11:30',
                title: 'Business Communication - Assessment',
                teacher: 'Sarah Johnson',
                location: 'Room 203'
            }
        ];

        // Personal information
        this.personalInfo = [
            {
                title: 'Nº Utente',
                value: '1000',
            },
            {
                title: 'Tipo de Inscrição',
                value: '4 Adults - Intermediate 1',
            },
            {
                title: 'Nº de Identificação',
                value: '0097529349LA083',
            },
            {
                title: 'Data de Nascimento',
                value: '12-04-2015',
            },
            {
                title: 'Telefone',
                value: '933449392',
            },
            {
                title: 'Nacionalidade',
                value: 'Angolana',
            },
            {
                title: 'Género',
                value: 'Masculino',
            },
        ];

        // Recent notifications
        this.notifications = [
            {
                title: 'Quiz Completed',
                message: 'Completed quiz #03-adjectives with score 85%',
                icon: 'pi pi-check-circle',
                time: '2 hours ago'
            },
            {
                title: 'Lesson Scheduled',
                message: 'New lesson scheduled for Oct 25, 10:00 AM',
                icon: 'pi pi-calendar',
                time: '1 day ago'
            },
            {
                title: 'Assessment Reminder',
                message: 'Unit 3 assessment scheduled for Oct 30',
                icon: 'pi pi-bell',
                time: '2 days ago'
            }
        ];
    }

    // Helper method to format dates
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
}
