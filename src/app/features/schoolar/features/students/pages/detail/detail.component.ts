import {CommonModule, DatePipe} from '@angular/common';
import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {Observable, Subscription} from 'rxjs';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {selectStudentById} from "../../../../../../core/store/schoolar/students/students.selectors";
import {Student} from "../../../../../../core/models/academic/students/student";
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
import {AvatarModule} from 'primeng/avatar';
import {MessageService, MenuItem} from 'primeng/api';
import {StudentPaymentTabComponent} from "./tabs/payments/payment.tab.component";
import {StudentLessonsTabComponent} from "./tabs/lessons/lessons.tab.component";
import {GeneralComponent} from "./tabs/general/general.component";
import {StudentCertificatesTabComponent} from "./tabs/certificates/certificates.tab.component";


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
        AvatarModule,
        StudentPaymentTabComponent,
        StudentLessonsTabComponent,
        GeneralComponent,
        StudentCertificatesTabComponent,
    ],
    providers: [DatePipe, MessageService],
    templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    protected router = inject(Router);
    private store$ = inject(Store);
    private datePipe = inject(DatePipe);
    private messageService = inject(MessageService);

    studentId!: string;
    student$?: Observable<Student | null>;
    private currentStudent: Student | null = null;
    private subscriptions = new Subscription();

    // Tab view properties
    currentView: string = 'overview';
    viewOptions = [
        {label: 'Visão geral', value: 'overview'},
        {label: 'Historico de aulas', value: 'lessons'},
        {label: 'Avaliações', value: 'assessments'},
        {label: 'Contratos', value: 'payments'},
        {label: 'Certificados', value: 'certificates'},
    ];

    // Documents menu
    documentMenuItems: MenuItem[] = [];

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

    navigateToScheduleLesson(): void {
        this.router.navigate(['/schoolar/lessons/schedule'], {queryParams: {studentId: this.studentId}}).then();
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
        return student.level.name;
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
