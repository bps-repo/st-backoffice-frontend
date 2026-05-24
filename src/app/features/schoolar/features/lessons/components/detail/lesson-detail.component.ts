import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, inject, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { MessageService, MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Lesson, LessonBooking, LessonUpdate } from "../../../../../../core/models/academic/lesson";
import { LessonStatus } from "../../../../../../core/enums/lesson-status";
import { LessonType } from "../../../../../../core/enums/lesson-type";
import { LessonStatusLabelPipe } from "../../../../../../shared/pipes/lesson-status-label.pipe";
import { LessonStatusSeverityPipe } from "../../../../../../shared/pipes/lesson-status-severity.pipe";
import { LessonStatusClassPipe } from "../../../../../../shared/pipes/lesson-status-class.pipe";
import { AttendanceStatus } from "../../../../../../core/enums/attendance-status";
import { LessonService } from "../../../../../../core/services/lessons/lesson.service";
import { LessonsFacade } from "../../../../../../core/services/lessons/lesson.facade";
import { AttendanceFacade } from "../../../../../../core/services/attendance/attendance.facade";
import { MaterialsFacade } from "../../../../../../core/services/materials/material.facade";
import { Student } from "../../../../../../core/models/academic/students/student";
import { Attendance } from "../../../../../../core/models/academic/attendance";
import { AttendanceStatusUpdate } from "../../../../../../core/models/academic/attendance-update";
import { Material } from "../../../../../../core/models/academic/material";

// Interface for notes
interface LessonNote {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    createdBy: string;
}

// Interface for attendance table data
interface AttendanceTableData {
    student: Student;
    attendance: Attendance;
    present: boolean;
    observations?: string;
}

@Component({
    selector: 'app-lesson-detail',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
        SelectButtonModule,
        TableModule,
        TagModule,
        DropdownModule,
        InputTextModule,
        FormsModule,
        DialogModule,
        DatePickerModule,
        SplitButtonModule,
        ToastModule,
        LessonStatusLabelPipe,
        LessonStatusSeverityPipe,
        LessonStatusClassPipe,
    ],
    providers: [MessageService],
    templateUrl: './lesson-detail.component.html'
})
export class LessonDetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private location = inject(Location);
    private lessonService = inject(LessonService);
    private lessonsFacade = inject(LessonsFacade);
    private messageService = inject(MessageService);

    protected readonly attendanceFacade = inject(AttendanceFacade);
    protected readonly materialsFacade = inject(MaterialsFacade);

    quickActions: any[] = [];

    // ── Reschedule modal ──────────────────────────────────────────────────────
    showRescheduleModal = false;
    rescheduleLoading = signal(false);
    rescheduleData: { startDatetime: Date | null; endDatetime: Date | null; justification: string } = {
        startDatetime: null,
        endDatetime: null,
        justification: ''
    };

    // ── Cancel confirmation modal ─────────────────────────────────────────────
    showCancelModal = false;
    cancelLoading = signal(false);
    cancelJustification = '';
    private pendingCancelLesson: Lesson | null = null;

    // ── Online link modal ─────────────────────────────────────────────────────
    showOnlineLinkModal = false;
    onlineLinkLoading = signal(false);
    onlineLinkValue = '';
    private pendingOnlineLesson: Lesson | null = null;

    // ── Update dropdown (SplitButton items) ──────────────────────────────────
    updateMenuItems: MenuItem[] = [];

    // Status options for the update dropdown
    lessonStatusOptions = [
        { label: 'Disponível',  value: LessonStatus.AVAILABLE },
        { label: 'Agendada',    value: LessonStatus.BOOKED },
        { label: 'Concluída',   value: LessonStatus.COMPLETED },
        { label: 'Cancelada',   value: LessonStatus.CANCELLED },
        { label: 'Adiada',      value: LessonStatus.POSTPONED },
    ];

    // Type options for the update dropdown
    lessonTypeOptions = [
        { label: 'Geral',         value: 'GENERAL' },
        { label: 'Gramática',     value: 'GRAMMAR' },
        { label: 'Vocabulário',   value: 'VOCABULARY' },
        { label: 'Pronúncia',     value: 'PRONUNCIATION' },
        { label: 'Escuta',        value: 'LISTENING' },
        { label: 'Escrita',       value: 'WRITING' },
        { label: 'Fala',          value: 'SPEAKING' },
        { label: 'Leitura',       value: 'READING' },
        { label: 'Conversação',   value: 'CONVERSATION' },
        { label: 'Prático',       value: 'PRACTICAL' },
        { label: 'Negócios',      value: 'BUSINESS' },
        { label: 'Outro',         value: 'OTHER' },
    ];

    // ── Core lesson state (signals) ───────────────────────────────────────────
    lesson = signal<Lesson | null>(null);
    loading = signal(false);
    loadError = signal<string | null>(null);
    loadingBookings = signal(false);

    // Signals exposed to template from facades
    readonly loadingAttendances = this.attendanceFacade.loading;
    readonly loadingMaterials = this.materialsFacade.loading;
    readonly attendanceError = this.attendanceFacade.error;

    // Bookings signal (students enrolled in this lesson)
    bookings = signal<LessonBooking[]>([]);

    // Inline update form (for the dropdown-driven edit panel)
    showUpdatePanel = signal(false);
    updateForm = signal<LessonUpdate>({});

    // Attendance data — kept as plain arrays, synced from facade signal via effect
    attendances: Attendance[] = [];
    attendanceTableData: AttendanceTableData[] = [];

    // Materials — synced from facade signal via effect
    materials: Material[] = [];

    notes: LessonNote[] = [];

    // Tab view properties
    currentView: string = 'overview';
    viewOptions = [
        { label: 'Visão Geral', value: 'overview' },
        { label: 'Alunos', value: 'students' },
        { label: 'Presença', value: 'attendance' },
        { label: 'Materiais', value: 'materials' },
        { label: 'Anotações', value: 'notes' },
    ];

    // Attendance status options for dropdown
    attendanceStatusOptions = [
        { label: 'Presente', value: AttendanceStatus.PRESENT },
        { label: 'Ausente', value: AttendanceStatus.ABSENT },
        { label: 'Pendente', value: AttendanceStatus.BOOKED }
    ];

    private destroy$ = new Subject<void>();
    private currentLessonId: string | null = null;

    constructor() {
        // Keep quickActions and updateMenuItems in sync with the current lesson signal
        effect(() => {
            const v = this.lesson();
            this.quickActions = [
                {
                    label: 'Marcar Aula',
                    icon: 'pi-calendar-plus',
                    iconColor: 'text-green-600',
                    bgColor: 'bg-green-100',
                    handler: () => v && this.scheduleLesson(v)
                },
                {
                    label: 'Marcar Presença',
                    icon: 'pi-check',
                    iconColor: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                    handler: () => this.markAttendance()
                },
                {
                    label: 'Adicionar Material',
                    icon: 'pi-plus-circle',
                    iconColor: 'text-green-600',
                    bgColor: 'bg-green-100',
                    handler: () => this.addMaterial(v!)
                },
                {
                    label: 'Fazer Anotação',
                    icon: 'pi-file-edit',
                    iconColor: 'text-orange-600',
                    bgColor: 'bg-orange-100',
                    handler: () => this.addNote()
                },
                {
                    label: 'Reagendar Aula',
                    icon: 'pi-clock',
                    iconColor: 'text-purple-600',
                    bgColor: 'bg-purple-100',
                    handler: () => v && this.openRescheduleModal(v)
                },
                {
                    label: 'Cancelar Aula',
                    icon: 'pi-times',
                    iconColor: 'text-red-600',
                    bgColor: 'bg-red-100',
                    handler: () => v && this.openCancelModal(v)
                },
                {
                    label: 'Enviar Notificação',
                    icon: 'pi-send',
                    iconColor: 'text-cyan-600',
                    bgColor: 'bg-cyan-100',
                    handler: () => this.sendNotification()
                }
            ];

            this.updateMenuItems = [
                {
                    label: 'Alterar Status',
                    icon: 'pi pi-tag',
                    items: this.lessonStatusOptions.map(opt => ({
                        label: opt.label,
                        command: () => v && this.patchField(v, { status: opt.value })
                    }))
                },
                {
                    label: 'Alterar Tipo',
                    icon: 'pi pi-list',
                    items: this.lessonTypeOptions.map(opt => ({
                        label: opt.label,
                        command: () => v && this.patchField(v, { type: opt.value })
                    }))
                },
                { separator: true },
                {
                    label: 'Tornar Online',
                    icon: 'pi pi-video',
                    command: () => v && this.openOnlineLinkModal(v)
                },
                {
                    label: 'Tornar Presencial',
                    icon: 'pi pi-building',
                    command: () => v && this.patchField(v, { online: false, onlineLink: '' })
                },
                { separator: true },
                {
                    label: 'Reagendar',
                    icon: 'pi pi-calendar',
                    command: () => v && this.openRescheduleModal(v)
                },
                {
                    label: 'Cancelar Aula',
                    icon: 'pi pi-times-circle',
                    styleClass: 'text-red-600',
                    command: () => v && this.openCancelModal(v)
                },
            ];
        });

        // Keep local attendances array in sync with facade signal
        effect(() => {
            this.attendances = this.attendanceFacade.attendances();
            this.attendanceTableData = this.buildAttendanceTableData(this.attendances);
        });

        // Keep local materials array in sync with facade signal
        effect(() => {
            this.materials = this.materialsFacade.materials();
        });
    }

    ngOnInit() {
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    this.currentLessonId = id;

                    // Load lesson via service
                    this.loading.set(true);
                    this.loadError.set(null);
                    this.lessonService.getLesson(id)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (lessonData) => {
                                this.lesson.set(lessonData);
                                this.loading.set(false);
                                this.loadError.set(null);
                            },
                            error: (err: unknown) => {
                                this.loading.set(false);
                                const msg =
                                    (err as { error?: { message?: string }; message?: string })?.error?.message ??
                                    (err as { message?: string })?.message ??
                                    'Erro ao carregar a aula';
                                this.loadError.set(msg);
                            }
                        });

                    // Load bookings via service
                    this.loadingBookings.set(true);
                    this.lessonService.getLessonBookings(id)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (b) => {
                                this.bookings.set(b ?? []);
                                this.loadingBookings.set(false);
                            },
                            error: () => {
                                this.bookings.set([]);
                                this.loadingBookings.set(false);
                            }
                        });
                    // Load attendances and materials through signal-based facades
                    void this.attendanceFacade.loadByLesson(id);
                    void this.materialsFacade.loadByEntity('LESSON', id);
                }
            });
    }

    ngOnDestroy(): void {
        this.attendanceFacade.clear();
        this.materialsFacade.clearMaterials();
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Navigation methods
    public goBack(): void {
        this.location.back();
    }

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
    }

    // KPI methods with real data
    public getStudentCount(): number {
        return this.bookings().length;
    }

    public getAttendanceRate(): number {
        if (this.attendances.length === 0) return 0;
        const presentCount = this.attendances.filter(a => a.present).length;
        return Math.round((presentCount / this.attendances.length) * 100);
    }

    public getMaterialCount(): number {
        return this.materials.length;
    }

    // Helper methods
    public getTeacherInitials(lesson: Lesson): string {
        if (!lesson || !lesson.teacher || !lesson.teacher.name) return 'MS';
        const names = lesson.teacher.name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return names[0].substring(0, 2).toUpperCase();
    }

    // Action methods
    public openOnlineLink(lesson: Lesson): void {
        if (lesson?.onlineLink) {
            window.open(lesson.onlineLink, '_blank');
        }
    }

    public markAttendance(): void {
        console.log('Mark attendance');
    }

    public addMaterial(lesson: Lesson): void {
        if (lesson.id) {
            this.router.navigate(['/schoolar/materials/create'], {
                queryParams: { entity: "LESSON", entityId: lesson.id }
            });
        }
    }

    // ── Reschedule modal ──────────────────────────────────────────────────────

    public openRescheduleModal(lesson: Lesson): void {
        this.rescheduleData = {
            startDatetime: lesson.startDatetime ? new Date(lesson.startDatetime) : null,
            endDatetime:   lesson.endDatetime   ? new Date(lesson.endDatetime)   : null,
            justification: ''
        };
        this.showRescheduleModal = true;
    }

    public async confirmReschedule(): Promise<void> {
        if (!this.currentLessonId) return;

        const { startDatetime, endDatetime, justification } = this.rescheduleData;
        if (!startDatetime || !endDatetime) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha as datas de início e fim.' });
            return;
        }
        if (endDatetime <= startDatetime) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'A data de fim deve ser posterior à de início.' });
            return;
        }

        this.rescheduleLoading.set(true);
        const payload: LessonUpdate = {
            startDatetime: startDatetime.toISOString().slice(0, 19),
            endDatetime:   endDatetime.toISOString().slice(0, 19),
            ...(justification?.trim() ? { justification: justification.trim() } : {})
        };

        const updated = await this.lessonsFacade.patchLesson(this.currentLessonId, payload);
        this.rescheduleLoading.set(false);

        if (updated) {
            this.lesson.set(updated);
            this.showRescheduleModal = false;
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aula reagendada com sucesso.' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.lessonsFacade.error() ?? 'Erro ao reagendar aula.' });
        }
    }

    public cancelReschedule(): void {
        this.showRescheduleModal = false;
    }

    // ── Cancel confirmation modal ─────────────────────────────────────────────

    public openCancelModal(lesson: Lesson): void {
        this.pendingCancelLesson = lesson;
        this.cancelJustification = '';
        this.showCancelModal = true;
    }

    public async confirmCancel(): Promise<void> {
        if (!this.pendingCancelLesson?.id) return;

        if (!this.cancelJustification.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe uma justificativa para o cancelamento.' });
            return;
        }

        this.cancelLoading.set(true);
        const updated = await this.lessonsFacade.patchLesson(this.pendingCancelLesson.id, {
            status: LessonStatus.CANCELLED,
            justification: this.cancelJustification.trim()
        });
        this.cancelLoading.set(false);

        if (updated) {
            this.lesson.set(updated);
            this.showCancelModal = false;
            this.pendingCancelLesson = null;
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aula cancelada com sucesso.' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.lessonsFacade.error() ?? 'Erro ao cancelar aula.' });
        }
    }

    public closeCancelModal(): void {
        this.showCancelModal = false;
        this.pendingCancelLesson = null;
    }

    // ── Online link modal ─────────────────────────────────────────────────────

    public openOnlineLinkModal(lesson: Lesson): void {
        this.pendingOnlineLesson = lesson;
        this.onlineLinkValue = lesson.onlineLink ?? '';
        this.showOnlineLinkModal = true;
    }

    public async confirmOnlineLink(): Promise<void> {
        if (!this.pendingOnlineLesson?.id) return;

        if (!this.onlineLinkValue.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe o link da aula online.' });
            return;
        }

        this.onlineLinkLoading.set(true);
        const updated = await this.lessonsFacade.patchLesson(this.pendingOnlineLesson.id, {
            online: true,
            onlineLink: this.onlineLinkValue.trim()
        });
        this.onlineLinkLoading.set(false);

        if (updated) {
            this.lesson.set(updated);
            this.showOnlineLinkModal = false;
            this.pendingOnlineLesson = null;
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aula configurada como online.' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.lessonsFacade.error() ?? 'Erro ao atualizar aula.' });
        }
    }

    public closeOnlineLinkModal(): void {
        this.showOnlineLinkModal = false;
        this.pendingOnlineLesson = null;
    }

    // ── Generic patch helper (used by update dropdown) ────────────────────────

    public async patchField(lesson: Lesson, payload: LessonUpdate): Promise<void> {
        if (!lesson.id) return;
        const updated = await this.lessonsFacade.patchLesson(lesson.id, payload);
        if (updated) {
            this.lesson.set(updated);
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aula atualizada com sucesso.' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.lessonsFacade.error() ?? 'Erro ao atualizar aula.' });
        }
    }

    public respondLesson(): void {
        console.log('Respond to lesson');
    }

    public sendNotification(): void {
        console.log('Send notification');
    }

    // Attendance table data helper
    public getAttendanceTableData(): AttendanceTableData[] {
        return this.attendanceTableData;
    }

    private buildAttendanceTableData(attendances: Attendance[]): AttendanceTableData[] {
        return attendances.map(attendance => {
            const student: Student = {
                id: attendance.studentId,
                code: 0,
                user: {
                    id: attendance.studentId,
                    email: '',
                    firstname: attendance.studentName.split(' ')[0] || attendance.studentName,
                    lastname: attendance.studentName.split(' ').slice(1).join(' ') || '',
                    phone: '',
                    roleName: 'STUDENT',
                    birthdate: '',
                    gender: '',
                    status: 'ACTIVE' as any
                },
                status: 'ACTIVE' as any,
                levelProgressPercentage: 0,
                center: {} as any,
                level: {} as any,
                enrollmentDate: attendance.createdAt,
                createdAt: attendance.createdAt,
                updatedAt: attendance.updatedAt
            };

            return {
                student,
                attendance,
                present: attendance.present,
                observations: attendance.justification
            };
        });
    }

    // Enhanced action methods
    public duplicateLesson(lesson: Lesson): void {
        if (lesson?.id) {
            this.router.navigate(['/schoolar/lessons/create'], {
                queryParams: { duplicateFrom: lesson.id }
            });
        }
    }

    public editLesson(lesson: Lesson): void {
        if (lesson?.id) {
            this.router.navigate(['/schoolar/lessons/edit', lesson.id]);
        }
    }

    public scheduleLesson(lesson: Lesson): void {
        if (lesson?.id) {
            this.router.navigate(['/schoolar/lessons/schedule'], { queryParams: { lessonId: lesson.id } });
        }
    }

    public exportLesson(lesson: Lesson): void {
        if (lesson?.id) {
            console.log('Exporting lesson:', lesson.id);
        }
    }

    public printLesson(lesson: Lesson): void {
        if (lesson?.id) {
            console.log('Printing lesson:', lesson.id);
        }
    }

    public configureOnlineLink(lesson: Lesson): void {
        if (lesson?.id) {
            console.log('Configuring online link for lesson:', lesson.id);
        }
    }

    public addStudent(): void {
        console.log('Adding student to lesson');
    }

    public viewStudentDetails(student: Student): void {
        if (student.id) {
            this.router.navigate(['/schoolar/students', student.id]);
        }
    }

    public editStudent(student: Student): void {
        if (student.id) {
            this.router.navigate(['/schoolar/students/edit', student.id]);
        }
    }

    public markAllPresent(): void {
        console.log('Marking all students as present');
    }

    public editAttendance(attendanceData: AttendanceTableData): void {
        console.log('Editing attendance for student:', attendanceData.student.id);
    }

    public updateAttendanceStatus(attendanceData: AttendanceTableData, newStatus: AttendanceStatus, justification: string): void {
        if (!attendanceData.attendance.id) {
            console.error('Attendance ID is required for update');
            return;
        }

        const statusUpdate: AttendanceStatusUpdate = { status: newStatus, justification };
        void this.attendanceFacade.updateStatus(attendanceData.attendance.id, statusUpdate);
    }

    public onAttendanceStatusChange(attendanceData: AttendanceTableData, newStatus: AttendanceStatus): void {
        let justification = '';
        switch (newStatus) {
            case AttendanceStatus.PRESENT:  justification = 'Present';  break;
            case AttendanceStatus.ABSENT:   justification = 'Absent';   break;
            case AttendanceStatus.BOOKED:   justification = 'Automatically created when lesson was booked'; break;
        }
        this.updateAttendanceStatus(attendanceData, newStatus, justification);
    }

    public downloadMaterial(material: Material): void {
        if (material.id) console.log('Downloading material:', material.id);
    }

    public editMaterial(material: Material): void {
        if (material.id) console.log('Editing material:', material.id);
    }

    public removeMaterial(material: Material): void {
        if (material.id) console.log('Removing material:', material.id);
    }

    public addNote(): void {
        console.log('Adding new note');
    }

    public editNote(note: LessonNote): void {
        console.log('Editing note:', note.id);
    }

    public removeNote(note: LessonNote): void {
        console.log('Removing note:', note.id);
    }

    protected LessonStatus = LessonStatus;
    protected AttendanceStatus = AttendanceStatus;

    public getAttendanceStatusText(status: string): string {
        switch (status) {
            case AttendanceStatus.PRESENT: return 'Presente';
            case AttendanceStatus.ABSENT:  return 'Ausente';
            case AttendanceStatus.BOOKED:  return 'Pendente';
            default: return 'Desconhecido';
        }
    }

    public getAttendanceStatusSeverity(status: string): string {
        switch (status) {
            case AttendanceStatus.PRESENT: return 'success';
            case AttendanceStatus.ABSENT:  return 'danger';
            case AttendanceStatus.BOOKED:  return 'warning';
            default: return 'secondary';
        }
    }
}
