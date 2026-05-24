import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Student } from 'src/app/core/models/academic/students/student';
import { StudentUnitProgress } from 'src/app/core/models/academic/students/student-unit-progress';
import { StudentService } from 'src/app/core/services/student.service';
import { StudentsActions } from 'src/app/core/store/schoolar/students/students.actions';
import { selectLoadingPhoto } from 'src/app/core/store/schoolar/students/students.selectors';

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
        FileUploadModule,
        DialogModule,
    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss',
})
export class GeneralComponent implements OnInit, OnDestroy, OnChanges {
    private studentService = inject(StudentService);
    private cdr = inject(ChangeDetectorRef);
    private destroy$ = new Subject<void>();
    private store = inject(Store);
    private actions$ = inject(Actions);
    private messageService = inject(MessageService);

    uploadingPhoto = this.store.selectSignal(selectLoadingPhoto);

    /** Modal for choosing a new profile photo (opened from pencil on avatar). */
    photoUploadDialogVisible = false;

    @Input() student: Student | null = null;
    @Input() studentId: string | null = null;

    unitProgresses: StudentUnitProgress[] = [];
    loadingProgresses = false;

    personalInfo: { title: string; value: string | number }[] = [];

    ngOnInit(): void {
        this.actions$.pipe(
            ofType(StudentsActions.updateStudentPhotoSuccess),
            filter(({ student }) => student.id === this.studentId),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.photoUploadDialogVisible = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Foto do aluno atualizada.',
            });
        });

        this.actions$.pipe(
            ofType(StudentsActions.updateStudentPhotoFailure),
            filter(({ studentId }) => studentId === this.studentId),
            takeUntil(this.destroy$)
        ).subscribe(({ error }) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: error,
            });
        });

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
            { title: 'Nº Utente', value: student.code ?? 'N/A' },
            { title: 'Nível', value: student.level?.name ?? 'N/A' },
            { title: 'Nº de Identificação', value: student.user?.identificationNumber ?? 'N/A' },
            { title: 'Data de Nascimento', value: student.user?.birthdate ?? 'N/A' },
            { title: 'Idade', value: this.getAge(student.user?.birthdate) ?? 'N/A' },
            { title: 'Telefone', value: student.user?.phone ?? 'N/A' },
            { title: 'Género', value: this.getGenderLabel(student.user?.gender ?? 'N/A') },
            { title: 'Background académico', value: student.academicBackground ?? 'N/A' },
            { title: 'Contacto de emergência', value: student.emergencyContactName ?? 'N/A' },
            { title: 'Relação com o contacto de emergência', value: student.emergencyContactRelationship ?? 'N/A' },
            { title: 'Tel. emergência', value: student.emergencyContactNumber ?? 'N/A' },
        ];
    }
    getGenderLabel(gender: string): string {
        const genderMap: Record<string, string> = {
            'MALE': 'Masculino',
            'FEMALE': 'Feminino',
            'OTHER': 'Outro',
            'PREFER_NOT_TO_SAY': 'Prefere não dizer'
        };
        return genderMap[gender] || gender;
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

    onPhotoSelectedInDialog(event: { files?: File[] }): void {
        const file = event.files?.[0];
        if (!file || !this.studentId) {
            return;
        }
        this.store.dispatch(
            StudentsActions.updateStudentPhoto({ studentId: this.studentId, photoFile: file })
        );
    }

    closePhotoUploadDialog(): void {
        this.photoUploadDialogVisible = false;
    }

    getAge(birthdate: string | null | undefined): string {
        if (!birthdate) return 'N/A';
        const dob = new Date(birthdate);
        if (Number.isNaN(dob.getTime())) {
            return 'N/A';
        }
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age.toString();
    }
}
