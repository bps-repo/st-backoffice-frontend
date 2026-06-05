// src/app/features/schoolar/features/meetings/pages/form/meeting-form.component.ts
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { catchError, finalize, map, take } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownFilterEvent } from 'primeng/dropdown';
import { MeetingService } from 'src/app/core/services/meeting.service';
import { StudentService } from 'src/app/core/services/student.service';
import { EmployeeService } from 'src/app/core/services/corporate/employee.service';
import { Meeting } from 'src/app/core/models/academic/meeting';
import { MeetingStatus } from 'src/app/core/enums/meeting-status';
import { Student } from 'src/app/core/models/academic/students/student';
import { Employee } from 'src/app/core/models/corporate/employee';
import { ApiError } from 'src/app/core/models/ApiError';
import { authFeature } from 'src/app/core/store/auth/auth.reducers';
import { MEETING_STATUS_LABELS } from '../../meeting-presenter';

@Component({
    selector: 'app-meeting-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        TextareaModule,
        DatePickerModule,
        InputSwitchModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './meeting-form.component.html',
})
export class MeetingFormComponent implements OnInit {
    private meetingService = inject(MeetingService);
    private studentService = inject(StudentService);
    private employeeService = inject(EmployeeService);
    private messageService = inject(MessageService);
    private store = inject(Store);
    private cdr = inject(ChangeDetectorRef);

    private studentSearch$ = new Subject<string>();
    private readonly minStudentSearchLength = 2;
    private currentUserEmployeeId: string | null = null;

    @Input() set visible(val: boolean) {
        this.dialogVisible.set(val);
        if (val) this.initForm();
    }

    @Input() set meeting(val: Meeting | null) {
        this.editingMeeting.set(val);
        if (this.dialogVisible()) this.initForm();
    }

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saved = new EventEmitter<void>();

    readonly dialogVisible = signal(false);
    readonly loading = signal(false);
    readonly loadingStudents = signal(false);
    readonly editingMeeting = signal<Meeting | null>(null);

    studentId: string | null = null;
    employeeId: string | null = null;
    startAt: Date | null = null;
    endAt: Date | null = null;
    purpose = '';
    online = false;
    onlineLink = '';
    status: MeetingStatus = MeetingStatus.REQUESTED;

    studentOptions: { label: string; value: string }[] = [];
    employeeOptions: { label: string; value: string }[] = [];

    readonly statusOptions = Object.values(MeetingStatus).map((status) => ({
        label: MEETING_STATUS_LABELS[status],
        value: status,
    }));

    readonly isEditMode = () => !!this.editingMeeting();

    ngOnInit(): void {
        this.loadEmployees();
        this.setupStudentSearch();
    }

    isFormValid(): boolean {
        if (!this.studentId || !this.employeeId || !this.purpose.trim() || !this.startAt || !this.endAt) {
            return false;
        }
        if (this.online && !this.onlineLink.trim()) return false;
        return this.endAt >= this.startAt;
    }

    save(): void {
        if (!this.isFormValid()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Formulário inválido',
                detail: 'Preencha todos os campos obrigatórios.',
            });
            return;
        }

        this.loading.set(true);
        const payload = {
            studentId: this.studentId!,
            employeeId: this.employeeId!,
            startAt: this.startAt!.toISOString(),
            endAt: this.endAt!.toISOString(),
            purpose: this.purpose.trim(),
            online: this.online,
            onlineLink: this.online ? this.onlineLink.trim() : undefined,
        };

        const request$ = this.isEditMode()
            ? this.meetingService.updateMeeting(this.editingMeeting()!.id, {
                  ...payload,
                  status: this.status,
              })
            : this.meetingService.createMeeting(payload);

        request$.subscribe({
            next: () => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.isEditMode()
                        ? 'Reunião atualizada com sucesso.'
                        : 'Reunião criada com sucesso.',
                });
                this.saved.emit();
                this.close();
            },
            error: (err: HttpErrorResponse) => this.handleError(err),
        });
    }

    close(): void {
        this.dialogVisible.set(false);
    }

    onDialogHide(): void {
        this.visibleChange.emit(false);
    }

    onStudentFilter(event: DropdownFilterEvent): void {
        this.studentSearch$.next(event.filter ?? '');
    }

    private initForm(): void {
        const meeting = this.editingMeeting();
        if (meeting) {
            this.studentId = meeting.studentId;
            this.employeeId = meeting.employeeId;
            this.startAt = new Date(meeting.startAt);
            this.endAt = new Date(meeting.endAt);
            this.purpose = meeting.purpose;
            this.online = meeting.online;
            this.onlineLink = meeting.onlineLink ?? '';
            this.status = meeting.status;
            this.studentOptions = [{ label: meeting.studentName, value: meeting.studentId }];
        } else {
            this.studentId = null;
            this.employeeId = null;
            this.startAt = null;
            this.endAt = null;
            this.purpose = '';
            this.online = false;
            this.onlineLink = '';
            this.status = MeetingStatus.REQUESTED;
            this.studentOptions = [];
            this.applyCurrentEmployeeDefault();
        }
    }

    private loadEmployees(): void {
        this.employeeService.getEmployees().subscribe({
            next: (employees) => {
                this.employeeOptions = employees.map((e) => ({
                    label: this.employeeLabel(e),
                    value: e.id,
                }));
                this.resolveCurrentEmployee(employees);
            },
            error: () => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'Não foi possível carregar os funcionários.',
                });
            },
        });
    }

    private setupStudentSearch(): void {
        this.studentSearch$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((query) => {
                    const trimmed = query.trim();
                    if (trimmed.length < this.minStudentSearchLength) {
                        return of([] as Student[]);
                    }
                    this.loadingStudents.set(true);
                    return this.studentService.searchStudentsPaginated({ fullName: trimmed }, 0, 20).pipe(
                        map((response) => response.content ?? []),
                        catchError(() => of([] as Student[])),
                        finalize(() => this.loadingStudents.set(false)),
                    );
                }),
            )
            .subscribe((students) => {
                this.studentOptions = students
                    .map((s) => this.toStudentOption(s))
                    .filter((o) => o.value);
            });
    }

    private toStudentOption(student: Student): { label: string; value: string } {
        return {
            value: student.id ?? '',
            label:
                `${student.user?.firstname ?? ''} ${student.user?.lastname ?? ''}`.trim() ||
                student.user?.email ||
                `Aluno #${student.code}`,
        };
    }

    private employeeLabel(employee: Employee): string {
        const { firstName, lastName, email } = employee.personalInfo;
        const name = `${firstName} ${lastName}`.trim();
        return name || email;
    }

    private resolveCurrentEmployee(employees: Employee[]): void {
        this.store.select(authFeature.selectUser).pipe(take(1)).subscribe((user) => {
            if (!user?.center) return;

            const match = employees.find((e) => e.personalInfo.userId === user.id);
            if (!match) return;

            this.currentUserEmployeeId = match.id;
            this.applyCurrentEmployeeDefault();
        });
    }

    private applyCurrentEmployeeDefault(): void {
        if (this.isEditMode() || !this.currentUserEmployeeId) return;
        this.employeeId = this.currentUserEmployeeId;
        this.cdr.markForCheck();
    }

    private handleError(err: HttpErrorResponse): void {
        this.loading.set(false);
        const apiError = err.error as ApiError;
        if (apiError?.errorCode === 'VALIDATION_ERROR' && apiError.validationErrors?.length) {
            apiError.validationErrors.forEach((ve) =>
                this.messageService.add({ severity: 'error', summary: 'Campo inválido', detail: ve.message }),
            );
            return;
        }
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: apiError?.error ?? apiError?.message ?? 'Não foi possível guardar a reunião.',
        });
    }
}
