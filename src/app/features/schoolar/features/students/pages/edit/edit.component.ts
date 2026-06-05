import {CommonModule} from '@angular/common';
import {Component, OnInit, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {take} from 'rxjs';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextarea} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {StudentsActions} from '../../../../../../core/store/schoolar/students/students.actions';
import {selectStudentById} from '../../../../../../core/store/schoolar/students/students.selectors';
import {StudentService} from '../../../../../../core/services/student.service';
import {LevelService} from '../../../../../../core/services/level.service';
import {CenterService} from '../../../../../../core/services/center.service';
import {UpdateStudentRequest} from '../../../../../../core/models/academic/students/update-student-request';
import {StudentStatus} from '../../../../../../core/models/academic/students/student';
import {Level} from '../../../../../../core/models/course/level';
import {Center} from '../../../../../../core/models/corporate/center';

@Component({
    selector: 'app-edit',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        InputTextModule,
        InputTextarea,
        CalendarModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private store$ = inject(Store);
    private studentService = inject(StudentService);
    private levelService = inject(LevelService);
    private centerService = inject(CenterService);
    private messageService = inject(MessageService);

    studentId!: string;
    loading = signal(false);
    saving = signal(false);

    form: UpdateStudentRequest = {
        enrollmentDate: undefined,
        status: undefined,
        centerId: undefined,
        levelId: undefined,
        levelProgressPercentage: undefined,
        emergencyContactName: null,
        emergencyContactNumber: null,
        emergencyContactRelationship: null,
        academicBackground: null,
        province: null,
        municipality: null,
        notes: null,
    };

    enrollmentDateModel: Date | null = null;

    levels: Level[] = [];
    centers: Center[] = [];

    readonly statusOptions = Object.values(StudentStatus).map(v => ({label: v, value: v}));

    readonly academicBackgroundOptions = [
        {label: 'Ensino Primário', value: 'PRIMARY_SCHOOL'},
        {label: 'Ensino Secundário', value: 'SECONDARY_SCHOOL'},
        {label: 'Ensino Médio', value: 'HIGH_SCHOOL'},
        {label: 'Universitário', value: 'UNIVERSITY'},
        {label: 'Pós-Graduação', value: 'POSTGRADUATE'},
        {label: 'Outro', value: 'OTHER'},
    ];

    ngOnInit(): void {
        this.route.params.pipe(take(1)).subscribe(params => {
            this.studentId = params['id'];
            this.store$.dispatch(StudentsActions.loadStudent({id: this.studentId}));

            this.store$.select(selectStudentById(this.studentId))
                .pipe(take(2))
                .subscribe(student => {
                    if (!student) return;
                    this.form = {
                        enrollmentDate: student.enrollmentDate,
                        status: student.status,
                        centerId: student.center?.id,
                        levelId: student.level?.id,
                        levelProgressPercentage: student.levelProgressPercentage,
                        emergencyContactName: student.emergencyContactName ?? null,
                        emergencyContactNumber: student.emergencyContactNumber ?? null,
                        emergencyContactRelationship: student.emergencyContactRelationship ?? null,
                        academicBackground: student.academicBackground ?? null,
                        province: student.province ?? null,
                        municipality: student.municipality ?? null,
                        notes: student.notes ?? null,
                    };
                    this.enrollmentDateModel = student.enrollmentDate
                        ? new Date(student.enrollmentDate)
                        : null;
                });
        });

        this.levelService.getLevels().pipe(take(1)).subscribe(levels => {
            this.levels = levels;
        });

        this.centerService.getAllCenters().pipe(take(1)).subscribe(centers => {
            this.centers = centers;
        });
    }

    onDateChange(date: Date | null): void {
        this.form.enrollmentDate = date ? date.toISOString().split('T')[0] : undefined;
    }

    save(): void {
        if (this.saving()) return;
        this.saving.set(true);

        this.studentService.updateStudentWithRequest(this.studentId, this.form)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.saving.set(false);
                    this.router.navigate(['/schoolar/students', this.studentId]).then();
                },
                error: (error) => {
                    this.saving.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: error?.error?.message ?? error?.message ?? 'Falha ao guardar alterações.',
                    });
                },
            });
    }

    cancel(): void {
        this.router.navigate(['/schoolar/students', this.studentId]).then();
    }
}
