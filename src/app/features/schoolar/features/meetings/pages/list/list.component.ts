// src/app/features/schoolar/features/meetings/pages/list/list.component.ts
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownFilterEvent } from 'primeng/dropdown';
import { MeetingService } from 'src/app/core/services/meeting.service';
import { StudentService } from 'src/app/core/services/student.service';
import { EmployeeService } from 'src/app/core/services/corporate/employee.service';
import { Meeting } from 'src/app/core/models/academic/meeting';
import { MeetingStatus } from 'src/app/core/enums/meeting-status';
import { Student } from 'src/app/core/models/academic/students/student';
import { Employee } from 'src/app/core/models/corporate/employee';
import { MeetingFormComponent } from '../form/meeting-form.component';
import { canCancelMeeting, meetingStatusLabel, meetingStatusSeverity } from '../../meeting-presenter';

@Component({
    selector: 'app-meetings-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        DatePickerModule,
        TableModule,
        TagModule,
        TooltipModule,
        ToastModule,
        ConfirmDialogModule,
        MeetingFormComponent,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './list.component.html',
})
export class MeetingsListComponent implements OnInit {
    private meetingService = inject(MeetingService);
    private studentService = inject(StudentService);
    private employeeService = inject(EmployeeService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    private studentSearch$ = new Subject<string>();
    private readonly minStudentSearchLength = 2;

    readonly meetings = signal<Meeting[]>([]);
    readonly loading = signal(false);
    readonly showFormDialog = signal(false);
    readonly editingMeeting = signal<Meeting | null>(null);
    readonly loadingStudents = signal(false);
    readonly cancellingMeetingId = signal<string | null>(null);

    filterStudentId: string | null = null;
    filterEmployeeId: string | null = null;
    filterStatus: MeetingStatus | null = null;
    filterStartAt: Date | null = null;
    filterEndAt: Date | null = null;

    studentFilterOptions: { label: string; value: string }[] = [];
    employeeFilterOptions: { label: string; value: string }[] = [];

    readonly statusOptions = [
        { label: 'Todos os status', value: null },
        { label: 'Solicitada', value: MeetingStatus.REQUESTED },
        { label: 'Confirmada', value: MeetingStatus.CONFIRMED },
        { label: 'Cancelada', value: MeetingStatus.CANCELLED },
        { label: 'Concluída', value: MeetingStatus.COMPLETED },
    ];

    readonly statusLabel = meetingStatusLabel;
    readonly statusSeverity = meetingStatusSeverity;
    readonly canCancel = canCancelMeeting;

    ngOnInit(): void {
        this.loadEmployees();
        this.setupStudentSearch();
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.meetingService
            .getMeetings({
                studentId: this.filterStudentId || undefined,
                employeeId: this.filterEmployeeId || undefined,
                status: this.filterStatus ?? undefined,
                startAt: this.filterStartAt?.toISOString(),
                endAt: this.filterEndAt?.toISOString(),
            })
            .subscribe({
                next: (meetings) => {
                    this.meetings.set(meetings);
                    this.loading.set(false);
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível carregar as reuniões.',
                    });
                    this.loading.set(false);
                },
            });
    }

    clearFilters(): void {
        this.filterStudentId = null;
        this.filterEmployeeId = null;
        this.filterStatus = null;
        this.filterStartAt = null;
        this.filterEndAt = null;
        this.studentFilterOptions = [];
        this.load();
    }

    openCreateDialog(): void {
        this.editingMeeting.set(null);
        this.showFormDialog.set(true);
    }

    openEditDialog(meeting: Meeting): void {
        this.editingMeeting.set(meeting);
        this.showFormDialog.set(true);
    }

    onFormDialogVisibleChange(visible: boolean): void {
        this.showFormDialog.set(visible);
        if (!visible) this.editingMeeting.set(null);
    }

    onStudentFilter(event: DropdownFilterEvent): void {
        this.studentSearch$.next(event.filter ?? '');
    }

    confirmCancelMeeting(meeting: Meeting): void {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja cancelar a reunião com ${meeting.studentName}?`,
            header: 'Cancelar reunião',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim, cancelar',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.cancelMeeting(meeting),
        });
    }

    isCancelling(meetingId: string): boolean {
        return this.cancellingMeetingId() === meetingId;
    }

    private cancelMeeting(meeting: Meeting): void {
        this.cancellingMeetingId.set(meeting.id);
        this.meetingService.updateMeeting(meeting.id, { status: MeetingStatus.CANCELLED }).subscribe({
            next: () => {
                this.cancellingMeetingId.set(null);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Reunião cancelada com sucesso.',
                });
                this.load();
            },
            error: () => {
                this.cancellingMeetingId.set(null);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível cancelar a reunião.',
                });
            },
        });
    }

    private loadEmployees(): void {
        this.employeeService.getEmployees().subscribe({
            next: (employees) => {
                this.employeeFilterOptions = employees.map((e) => ({
                    label: this.employeeLabel(e),
                    value: e.id,
                }));
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
                this.studentFilterOptions = students
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
}
