import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Location} from '@angular/common';
import {Lesson} from "../../../../../../core/models/academic/lesson";
import {LessonStatus} from "../../../../../../core/enums/lesson-status";
import {lessonsActions} from "../../../../../../core/store/schoolar/lessons/lessons.actions";

@Component({
    selector: 'app-lesson-detail',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
    ],
    templateUrl: './lesson-detail.component.html'
})
export class LessonDetailComponent implements OnInit, OnDestroy {
    lesson?: Lesson | null
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store,
        private location: Location
    ) {
    }

    ngOnInit() {
        // Get the lesson ID from the route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    // Dispatch action to load the lesson
                    this.store.dispatch(lessonsActions.loadLesson({id}));
                }
            });

        // Mock lesson data for demo purposes (remove when real data is available)
        this.lesson = {
            id: '1',
            title: 'English Conversation A1',
            level: 'A1',
            center: 'Centro Principal',
            teacher: 'Prof. Maria Silva',
            startDatetime: new Date().toISOString(),
            endDatetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            status: LessonStatus.BOOKED,
            online: false,
            onlineLink: undefined,
            unit: 'Turma A',
            description: 'Aula de conversação em inglês para iniciantes',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Navigation methods
    public goBack(): void {
        this.location.back();
    }

    // KPI methods
    public getStudentCount(): number {
        // Mock data - replace with real data from store
        return 3;
    }

    public getAttendanceRate(): number {
        // Mock data - replace with real calculation
        return 67;
    }

    public getMaterialCount(): number {
        // Mock data - replace with real data from store
        return 2;
    }

    // Helper methods
    public getTeacherInitials(): string {
        if (!this.lesson?.teacher) return 'MS';

        const names = this.lesson.teacher.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return names[0].substring(0, 2).toUpperCase();
    }

    // Action methods
    public openOnlineLink(): void {
        if (this.lesson?.onlineLink) {
            window.open(this.lesson.onlineLink, '_blank');
        }
    }

    public markAttendance(): void {
        console.log('Mark attendance');
        // Implement attendance marking logic
    }

    public addMaterial(): void {
        if (this.lesson?.id) {
            this.router.navigate(['/schoolar/lessons/materials/add', this.lesson.id]);
        }
    }

    public rescheduleLesson(): void {
        console.log('Reschedule lesson');
        // Implement reschedule logic
    }

    public respondLesson(): void {
        console.log('Respond to lesson');
        // Implement respond logic
    }

    public cancelLesson(): void {
        console.log('Cancel lesson');
        // Implement cancel logic
    }

    public sendNotification(): void {
        console.log('Send notification');
        // Implement notification logic
    }

    protected LessonStatus = LessonStatus;
}
