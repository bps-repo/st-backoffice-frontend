import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, inject, ChangeDetectorRef} from '@angular/core';
import {CardModule} from 'primeng/card';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {DividerModule} from 'primeng/divider';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {ProgressBarModule} from 'primeng/progressbar';
import {Subject, takeUntil} from 'rxjs';
import {Student} from 'src/app/core/models/academic/students/student';
import {StudentUnitProgress} from 'src/app/core/models/academic/students/student-unit-progress';
import {StudentService} from 'src/app/core/services/student.service';

@Component({
    selector: 'app-general',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        AvatarModule,
        BadgeModule,
        DividerModule,
        TagModule,
        ButtonModule,
        ProgressBarModule,
    ],
    templateUrl: './general.component.html',
})
export class GeneralComponent implements OnInit, OnDestroy, OnChanges {
    private studentService = inject(StudentService);
    private cdr = inject(ChangeDetectorRef);
    private destroy$ = new Subject<void>();

    @Input() student: Student | null = null;
    @Input() studentId: string | null = null;

    unitProgresses: StudentUnitProgress[] = [];
    loadingProgresses = false;

    personalInfo: {title: string; value: string | number}[] = [];

    ngOnInit(): void {
        if (this.student) {
            this.buildPersonalInfo(this.student);
        }
        if (this.studentId) {
            this.loadUnitProgresses();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['student']?.currentValue) {
            this.buildPersonalInfo(changes['student'].currentValue as Student);
        }
        if (changes['studentId'] && !changes['studentId'].firstChange && this.studentId) {
            this.loadUnitProgresses();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadUnitProgresses(): void {
        if (!this.studentId) return;
        this.loadingProgresses = true;
        this.studentService.getStudentUnitProgresses(this.studentId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.unitProgresses = data;
                    this.loadingProgresses = false;
                    this.cdr.detectChanges();
                },
                error: () => {
                    this.loadingProgresses = false;
                    this.cdr.detectChanges();
                },
            });
    }

    private buildPersonalInfo(student: Student): void {
        this.personalInfo = [
            {title: 'Nº Utente', value: student.code ?? 'N/A'},
            {title: 'Nível', value: student.level?.name ?? 'N/A'},
            {title: 'Nº de Identificação', value: student.user?.identificationNumber ?? 'N/A'},
            {title: 'Data de Nascimento', value: student.user?.birthdate ?? 'N/A'},
            {title: 'Telefone', value: student.user?.phone ?? 'N/A'},
            {title: 'Género', value: student.user?.gender ?? 'N/A'},
            {title: 'Background académico', value: student.academicBackground ?? 'N/A'},
            {title: 'Contacto de emergência', value: student.emergencyContactName ?? 'N/A'},
            {title: 'Tel. emergência', value: student.emergencyContactNumber ?? 'N/A'},
        ];
    }

    getUnitStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            COMPLETED: 'success',
            IN_PROGRESS: 'info',
            PENDING: 'secondary',
        };
        return map[status] ?? 'secondary';
    }

    getUnitStatusLabel(status: string): string {
        const map: Record<string, string> = {
            COMPLETED: 'Concluída',
            IN_PROGRESS: 'Em progresso',
            PENDING: 'Pendente',
        };
        return map[status] ?? status;
    }

    formatDate(dateString: string | null | undefined): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-AO', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    }

    get photoUrl(): string {
        return this.student?.user?.photo ||
            'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg';
    }
}
