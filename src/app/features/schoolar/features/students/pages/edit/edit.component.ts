import {CommonModule} from '@angular/common';
import {Component, OnInit, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {forkJoin, of, take} from 'rxjs';
import {filter} from 'rxjs/operators';
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
import {UserManagementService} from '../../../../../../core/services/user-management.service';
import {UpdateStudentRequest} from '../../../../../../core/models/academic/students/update-student-request';
import {UpdateUserRequest} from '../../../../../../core/models/update-user-request';

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
    private userManagementService = inject(UserManagementService);
    private messageService = inject(MessageService);

    studentId!: string;
    private userId!: string;
    saving = signal(false);

    studentForm: UpdateStudentRequest = {
        enrollmentDate: undefined,
        emergencyContactName: null,
        emergencyContactNumber: null,
        emergencyContactRelationship: null,
        academicBackground: null,
        province: null,
        municipality: null,
        notes: null,
    };

    userForm: UpdateUserRequest = {
        firstname: undefined,
        lastname: undefined,
        email: undefined,
        phone: undefined,
        gender: undefined,
        birthdate: undefined,
    };

    enrollmentDateModel: Date | null = null;
    birthdateModel: Date | null = null;

    readonly genderOptions = [
        {label: 'Masculino', value: 'MALE'},
        {label: 'Feminino', value: 'FEMALE'},
        {label: 'Outro', value: 'OTHER'},
    ];

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
                .pipe(filter(Boolean), take(1))
                .subscribe(student => {

                    this.userId = student.user?.id;

                    this.studentForm = {
                        enrollmentDate: student.enrollmentDate,
                        emergencyContactName: student.emergencyContactName ?? null,
                        emergencyContactNumber: student.emergencyContactNumber ?? null,
                        emergencyContactRelationship: student.emergencyContactRelationship ?? null,
                        academicBackground: student.academicBackground ?? null,
                        province: student.province ?? null,
                        municipality: student.municipality ?? null,
                        notes: student.notes ?? null,
                    };

                    this.userForm = {
                        firstname: student.user?.firstname,
                        lastname: student.user?.lastname,
                        email: student.user?.email,
                        phone: student.user?.phone,
                        gender: student.user?.gender,
                        birthdate: student.user?.birthdate,
                    };

                    this.enrollmentDateModel = student.enrollmentDate
                        ? new Date(student.enrollmentDate)
                        : null;

                    this.birthdateModel = student.user?.birthdate
                        ? new Date(student.user.birthdate)
                        : null;
                });
        });
    }

    onEnrollmentDateChange(date: Date | null): void {
        this.studentForm.enrollmentDate = date ? date.toISOString().split('T')[0] : undefined;
    }

    onBirthdateChange(date: Date | null): void {
        this.userForm.birthdate = date ? date.toISOString().split('T')[0] : undefined;
    }

    save(): void {
        if (this.saving()) return;
        this.saving.set(true);

        const student$ = this.studentService.updateStudentWithRequest(this.studentId, this.studentForm);
        const user$ = this.userId
            ? this.userManagementService.patchUser(this.userId, this.userForm)
            : of(null);

        forkJoin([student$, user$])
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
