import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {InputTextModule} from 'primeng/inputtext';
import {PieChartComponent} from 'src/app/shared/components/charts/pie-chart/pie-chart.component';
import {CardModule} from 'primeng/card';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {DividerModule} from 'primeng/divider';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ProgressBarModule} from 'primeng/progressbar';
import {TimelineModule} from 'primeng/timeline';
import {TableModule} from 'primeng/table';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {Student} from 'src/app/core/models/academic/student';
import {ActivatedRoute} from '@angular/router';
import {selectStudentById} from 'src/app/core/store/schoolar/students/students.selectors';

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
export class GeneralComponent implements OnInit, OnDestroy {
    Math = Math;

    // Student information
    studentInfo: any = {};

    student$!: Observable<Student | null>;

    studentId: string | null = null;

    private subscriptions = new Subscription();

    // Academic progress
    unitProgress: number = 75;

    levelProgress: number = 45;

    // Scheduled lessons
    upcomingLessons: any[] = [];

    // Personal information
    personalInfo: any[] = [];

    // Notifications
    notifications: any[] = [];

    constructor(
        private store: Store,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Get the student ID from the route
        this.subscriptions.add(
            this.route.parent?.params.subscribe(params => {
                this.studentId = params['id'];
                if (this.studentId) {
                    this.student$ = this.store.select(selectStudentById(this.studentId));

                    // Subscribe to student data
                    this.subscriptions.add(
                        this.student$.subscribe(student => {
                            if (student) {
                                this.updateStudentInfo(student);
                            }
                        })
                    );
                }
            })
        );

        // Mock upcoming lessons (this could be replaced with real data from an API)
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

        // Recent notifications (this could be replaced with real data from an API)
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

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    updateStudentInfo(student: Student): void {
        this.studentInfo = {
            id: student.id,
            name: student.user?.firstName || 'N/A',
            email: student.user?.email || 'N/A',
            center: student.centerId || 'N/A',
            course: 'English Language', // This could be derived from student.levelId
            level: student.levelId || 'N/A',
            unit: student.currentUnit?.name || 'N/A',
            unitOrder: student.currentUnit?.order || 1,
            totalUnits: 4, // This could be derived from the level
            phone: student.user?.phone || 'N/A',
            status: student.status || 'N/A',
            enrollmentDate: student.enrollmentDate || new Date().toISOString(),
            photo: student.user?.photo || 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg'
        };

        // Update personal information
        this.personalInfo = [
            {
                title: 'Nº Utente',
                value: student.code || 'N/A',
            },
            {
                title: 'Tipo de Inscrição',
                value: student.levelId ? `${student.levelId}` : 'N/A',
            },
            {
                title: 'Nº de Identificação',
                value: student.user?.identificationNumber || 'N/A',
            },
            {
                title: 'Data de Nascimento',
                value: student.user?.dateOfBirth || 'N/A',
            },
            {
                title: 'Telefone',
                value: student.user?.phone || 'N/A',
            },
            {
                title: 'Género',
                value: student.user?.gender || 'N/A',
            },
        ];

        // Update progress based on student data
        this.unitProgress = student.levelProgressPercentage || 0;
        this.levelProgress = student.levelProgressPercentage || 0;
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
