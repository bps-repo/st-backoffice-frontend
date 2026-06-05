import {CommonModule, DatePipe} from '@angular/common';
import {Component, OnDestroy, OnInit, inject, signal} from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {Observable, Subscription, take} from 'rxjs';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ActivatedRoute, Router} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from "@ngrx/store";
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {selectStudentById} from "../../../../../../core/store/schoolar/students/students.selectors";
import {Student, StudentStatus} from "../../../../../../core/models/academic/students/student";
import {UpdateStudentRequest} from "../../../../../../core/models/academic/students/update-student-request";
import {Center} from "../../../../../../core/models/corporate/center";
import {StyleClassModule} from "primeng/styleclass";
import {CardModule} from 'primeng/card';
import {ProgressBarModule} from 'primeng/progressbar';
import {ButtonModule} from 'primeng/button';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {MenuModule} from 'primeng/menu';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AvatarModule} from 'primeng/avatar';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmationService, MessageService, MenuItem} from 'primeng/api';
import {StudentPaymentTabComponent} from "./tabs/payments/payment.tab.component";
import {StudentLessonsTabComponent} from "./tabs/lessons/lessons.tab.component";
import {GeneralComponent} from "./tabs/general/general.component";
import {StudentCertificatesTabComponent} from "./tabs/certificates/certificates.tab.component";
import {AvaliacoesComponent} from "./tabs/avaliacoes/avaliacoes.component";
import {CenterService} from "../../../../../../core/services/center.service";
import {StudentService} from "../../../../../../core/services/student.service";
import {LegalGuardian} from "../../../../../../core/models/academic/students/legal-guardian";
import {StudentPortalAccessTabComponent} from "./tabs/portal-access/portal-access.tab.component";


@Component({
    selector: 'app-student',
    imports: [
        TabMenuModule,
        TabViewModule,
        CommonModule,
        SplitButtonModule,
        StyleClassModule,
        CardModule,
        ProgressBarModule,
        ButtonModule,
        SelectButtonModule,
        FormsModule,
        MenuModule,
        DialogModule,
        DropdownModule,
        ToastModule,
        ConfirmDialogModule,
        AvatarModule,
        InputTextModule,
        StudentPaymentTabComponent,
        StudentLessonsTabComponent,
        GeneralComponent,
        StudentCertificatesTabComponent,
        AvaliacoesComponent,
        StudentPortalAccessTabComponent,
    ],
    providers: [DatePipe, MessageService, ConfirmationService],
    templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    protected router = inject(Router);
    private store$ = inject(Store);
    private actions$ = inject(Actions);
    private datePipe = inject(DatePipe);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private centerService = inject(CenterService);
    private studentService = inject(StudentService);

    studentId!: string;
    student$?: Observable<Student | null>;
    private currentStudent: Student | null = null;
    private subscriptions = new Subscription();

    centers: Center[] = [];
    centerActionDialogVisible = false;
    centerActionMode: 'assign' | 'remove' = 'assign';
    selectedCenterId: string | null = null;
    centerActionLoading = signal(false);
    syncLevelLoading = signal(false);

    legalGuardiansDialogVisible = false;
    legalGuardians: LegalGuardian[] = [];
    legalGuardiansLoading = signal(false);

    statusDialogVisible = false;
    selectedStatus: string | null = null;
    statusUpdateLoading = signal(false);
    readonly statusOptions = Object.values(StudentStatus).map(v => ({label: v, value: v}));

    // Tab view properties
    currentView: string = 'overview';
    viewOptions = [
        {label: 'Visão geral', value: 'overview'},
        {label: 'Historico de aulas', value: 'lessons'},
        {label: 'Avaliações', value: 'assessments'},
        {label: 'Contratos', value: 'payments'},
        {label: 'Certificados', value: 'certificates'},
        {label: 'Acesso ao portal', value: 'portal-access'},
    ];

    // Documents menu
    documentMenuItems: MenuItem[] = [];
    actionsMenuItems: MenuItem[] = [];

    // Avatar helpers
    get studentPhotoUrl(): string | null {
        const photo = this.currentStudent?.user?.photo;
        return photo && photo.trim() !== '' ? photo : null;
    }

    get studentInitials(): string {
        const u = this.currentStudent?.user;
        if (!u) return '?';
        return ((u.firstname?.[0] ?? '') + (u.lastname?.[0] ?? '')).toUpperCase();
    }

    // Certificate dialog
    certificateDialogVisible = false;
    selectedCertificateLevel: string | null = null;
    get certificateLevelOptions(): {label: string; value: string}[] {
        if (!this.currentStudent?.level) return [];
        return [{label: this.currentStudent.level.name, value: this.currentStudent.level.id ?? ''}];
    }

    onViewChange(event: any) {
        this.currentView = event.value;
    }

    ngOnInit() {
        this.actionsMenuItems = [
            {
                label: 'Ações',
                items: [
                    {
                        label: 'Transferência de Centro',
                        icon: 'pi pi-building',
                        command: () => this.openCenterActionDialog('assign'),
                    },
                    {
                        label: 'Remover Centro',
                        icon: 'pi pi-building-columns',
                        command: () => this.openCenterActionDialog('remove'),
                    },
                    {
                        label: 'Sincronizar Nível',
                        icon: 'pi pi-sync',
                        command: () => this.confirmSyncLevel(),
                    },
                    {
                        label: 'Responsáveis Legais',
                        icon: 'pi pi-users',
                        command: () => this.openLegalGuardiansDialog(),
                    },
                    {
                        label: 'Alterar Estado',
                        icon: 'pi pi-tag',
                        command: () => this.openStatusDialog(),
                    },
                ],
            },
        ];

        this.subscriptions.add(
            this.centerService.getAllCenters().subscribe({
                next: (centers) => { this.centers = centers; },
            }),
        );

        this.subscriptions.add(
            this.actions$.pipe(
                ofType(
                    StudentsActions.addStudentToCenterSuccess,
                    StudentsActions.removeStudentFromCenterSuccess,
                ),
            ).subscribe(() => {
                this.centerActionLoading.set(false);
                this.centerActionDialogVisible = false;
                this.reloadStudent();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.centerActionMode === 'assign'
                        ? 'Centro atribuído com sucesso.'
                        : 'Centro removido com sucesso.',
                });
            }),
        );

        this.subscriptions.add(
            this.actions$.pipe(
                ofType(
                    StudentsActions.addStudentToCenterFailure,
                    StudentsActions.removeStudentFromCenterFailure,
                ),
            ).subscribe(({error}) => {
                this.centerActionLoading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error,
                });
            }),
        );

        this.documentMenuItems = [
            {
                label: 'Documentos',
                items: [
                    {
                        label: 'Ficha do Aluno',
                        icon: 'pi pi-id-card',
                        command: () => this.exportStudentDetails(),
                    },
                    {
                        label: 'Certificado',
                        icon: 'pi pi-verified',
                        command: () => this.openCertificateDialog(),
                    },
                    {
                        label: 'Declaração de Frequência',
                        icon: 'pi pi-calendar-clock',
                        command: () => this.exportAttendanceDeclaration(),
                    },
                    {
                        label: 'Ficha de Inscrição',
                        icon: 'pi pi-file-edit',
                        command: () => this.exportRegistrationForm(),
                    },
                ],
            },
        ];

        this.route.params.subscribe(params => {
            this.studentId = params['id'];
            if (this.studentId) {
                this.store$.dispatch(StudentsActions.loadStudent({id: this.studentId}));
                this.student$ = this.store$.select(selectStudentById(this.studentId));
                this.student$.subscribe(s => { this.currentStudent = s; });
            }
        });
    }

    // ── Document actions ──────────────────────────────────────────────────────

    exportStudentDetails(): void {
        // TODO: call API endpoint to generate/download student details PDF
        this.messageService.add({
            severity: 'info',
            summary: 'Ficha do Aluno',
            detail: 'A gerar ficha do aluno…',
        });
    }

    openCertificateDialog(): void {
        this.selectedCertificateLevel = this.currentStudent?.level?.id ?? null;
        this.certificateDialogVisible = true;
    }

    downloadCertificate(): void {
        if (!this.selectedCertificateLevel) return;
        this.certificateDialogVisible = false;
        // TODO: call API endpoint to generate/download certificate for the selected level
        this.messageService.add({
            severity: 'info',
            summary: 'Certificado',
            detail: 'A gerar certificado…',
        });
    }

    exportAttendanceDeclaration(): void {
        // TODO: call API endpoint to generate/download attendance declaration PDF
        this.messageService.add({
            severity: 'info',
            summary: 'Declaração de Frequência',
            detail: 'A gerar declaração de frequência…',
        });
    }

    exportRegistrationForm(): void {
        // TODO: call API endpoint to generate/download registration form PDF
        this.messageService.add({
            severity: 'info',
            summary: 'Ficha de Inscrição',
            detail: 'A gerar ficha de inscrição…',
        });
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.store$.dispatch(StudentsActions.clearSelection());
    }

    navigateToEdit(): void {
        this.router.navigate(['/schoolar/students', this.studentId, 'edit']).then();
    }

    navigateToScheduleLesson(): void {
        this.router.navigate(['/schoolar/lessons/schedule'], {queryParams: {studentId: this.studentId}}).then();
    }

    get centerActionDialogTitle(): string {
        return this.centerActionMode === 'assign' ? 'Atribuir Centro' : 'Remover Centro';
    }

    get centerActionDialogDescription(): string {
        return this.centerActionMode === 'assign'
            ? 'Selecione o centro ao qual pretende atribuir o aluno.'
            : 'Selecione o centro que pretende remover do aluno.';
    }

    openCenterActionDialog(mode: 'assign' | 'remove'): void {
        this.centerActionMode = mode;
        this.selectedCenterId = mode === 'remove'
            ? (this.currentStudent?.center?.id ?? null)
            : null;
        this.centerActionDialogVisible = true;
    }

    submitCenterAction(): void {
        if (!this.selectedCenterId || !this.studentId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Selecione um centro.',
            });
            return;
        }

        this.centerActionLoading.set(true);

        if (this.centerActionMode === 'assign') {
            this.store$.dispatch(StudentsActions.addStudentToCenter({
                studentId: this.studentId,
                centerId: this.selectedCenterId,
            }));
            return;
        }

        this.store$.dispatch(StudentsActions.removeStudentFromCenter({
            studentId: this.studentId,
            centerId: this.selectedCenterId,
        }));
    }

    confirmSyncLevel(): void {
        this.confirmationService.confirm({
            header: 'Sincronizar Nível',
            message: 'Pretende sincronizar o nível do aluno com base no progresso actual?',
            icon: 'pi pi-sync',
            acceptLabel: 'Sincronizar',
            rejectLabel: 'Cancelar',
            accept: () => this.syncStudentLevel(),
        });
    }

    syncStudentLevel(): void {
        if (!this.studentId || this.syncLevelLoading()) {
            return;
        }

        this.syncLevelLoading.set(true);
        this.studentService.syncStudentLevel(this.studentId)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.syncLevelLoading.set(false);
                    this.reloadStudent();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Nível sincronizado com sucesso.',
                    });
                },
                error: (error) => {
                    this.syncLevelLoading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: error?.error?.message ?? error?.message ?? 'Falha ao sincronizar o nível.',
                    });
                },
            });
    }

    openStatusDialog(): void {
        this.selectedStatus = this.currentStudent?.status ?? null;
        this.statusDialogVisible = true;
    }

    submitStatusUpdate(): void {
        if (!this.selectedStatus || !this.studentId || this.statusUpdateLoading()) return;

        this.statusUpdateLoading.set(true);
        const request: UpdateStudentRequest = {status: this.selectedStatus};
        this.studentService.updateStudentWithRequest(this.studentId, request)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.statusUpdateLoading.set(false);
                    this.statusDialogVisible = false;
                    this.reloadStudent();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Estado do aluno atualizado com sucesso.',
                    });
                },
                error: (error) => {
                    this.statusUpdateLoading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: error?.error?.message ?? error?.message ?? 'Falha ao atualizar o estado.',
                    });
                },
            });
    }

    openLegalGuardiansDialog(): void {
        this.legalGuardians = [{name: '', phone: '', email: '', kinship: ''}];
        this.legalGuardiansDialogVisible = true;
    }

    addLegalGuardian(): void {
        if (this.legalGuardians.length < 2) {
            this.legalGuardians = [...this.legalGuardians, {name: '', phone: '', email: '', kinship: ''}];
        }
    }

    removeLegalGuardian(index: number): void {
        this.legalGuardians = this.legalGuardians.filter((_, i) => i !== index);
    }

    submitLegalGuardians(): void {
        if (!this.studentId || this.legalGuardiansLoading()) return;

        this.legalGuardiansLoading.set(true);
        this.studentService.updateLegalGuardians(this.studentId, this.legalGuardians)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.legalGuardiansLoading.set(false);
                    this.legalGuardiansDialogVisible = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Responsáveis legais atualizados com sucesso.',
                    });
                },
                error: (error) => {
                    this.legalGuardiansLoading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: error?.error?.message ?? error?.message ?? 'Falha ao atualizar responsáveis legais.',
                    });
                },
            });
    }

    private reloadStudent(): void {
        if (!this.studentId) {
            return;
        }
        this.store$.dispatch(StudentsActions.loadStudent({id: this.studentId}));
    }

    /**
     * Calculate and return the student's attendance percentage
     */
    getAttendancePercentage(student: Student): number {
        return Math.min(100, Math.max(0, 22));
    }

    /**
     * Get the name of the student's current level
     */
    getLevelName(student: Student): string {
        return student.level?.name || 'N/A';
    }

    /**
     * Get the number of completed lessons
     */
    getCompletedLessons(student: Student): number {

        return Math.max(0, 4);
    }

    /**
     * Get the total number of lessons
     */
    getTotalLessons(student: Student): number {
        return Math.max(0, 35);
    }

    /**
     * Calculate the number of missing/pending lessons
     */
    getMissingLessons(student: Student): number {
        if (!student) {
            return 0;
        }
        const completed = this.getCompletedLessons(student);
        const total = this.getTotalLessons(student);
        return Math.max(0, total - completed);
    }

    /**
     * Return the appropriate CSS class based on student status
     */
    getStatusColor(student: Student): string {
        if (!student || !student.status) {
            return 'text-gray-500'; // Default color for undefined status
        }

        // Map status to color classes
        const statusColorMap: Record<string, string> = {
            'ACTIVE': 'text-green-500',
            'INACTIVE': 'text-red-500',
            'SUSPENDED': 'text-yellow-500',
            'GRADUATED': 'text-blue-500',
            'PENDING': 'text-gray-500'
        };

        return statusColorMap[student.status.toUpperCase()] || 'text-gray-500';
    }

    /**
     * Format the enrollment date
     */
    formatDate(date: string | Date | null | undefined): string {
        if (!date) {
            return 'N/A';
        }

        try {
            const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
            return formattedDate || 'N/A';
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    }
}
