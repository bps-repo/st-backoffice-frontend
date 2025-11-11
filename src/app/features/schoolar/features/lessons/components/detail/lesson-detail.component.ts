import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, Observable, combineLatest, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Lesson, LessonBooking } from "../../../../../../core/models/academic/lesson";
import { LessonStatus } from "../../../../../../core/enums/lesson-status";
import { AttendanceStatus } from "../../../../../../core/enums/attendance-status";
import { lessonsActions } from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import { selectSelectedLesson, selectLoadingLessons, selectError, selectLessonBookings, selectBookings } from "../../../../../../core/store/schoolar/lessons/lessons.selectors";
import { attendancesActions } from "../../../../../../core/store/schoolar/attendances/attendances.actions";
import { selectAttendancesByLesson, selectAttendancesLoading, selectAttendancesError } from "../../../../../../core/store/schoolar/attendances/attendances.selectors";
import { Student } from "../../../../../../core/models/academic/student";
import { Attendance } from "../../../../../../core/models/academic/attendance";
import { AttendanceStatusUpdate } from "../../../../../../core/models/academic/attendance-update";
import { Material } from "../../../../../../core/models/academic/material";
import { StudentService } from "../../../../../../core/services/student.service";
import { MaterialService } from "../../../../../../core/services/material.service";
import { LessonService } from "../../../../../../core/services/lesson.service";
import { MaterialActions } from "../../../../../../core/store/schoolar/materials/material.actions";
import { selectMaterialsByEntityAndId } from "../../../../../../core/store/schoolar/materials/material.selectors";
import { selectLoadingMaterials } from 'src/app/core/store/schoolar/units/unit.selectors';
import { selectStudentAnyLoading } from 'src/app/core/store/schoolar/students/students.selectors';

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
    ],
    templateUrl: './lesson-detail.component.html'
})
export class LessonDetailComponent implements OnInit, OnDestroy {
    quickActions: any[] = []
    lesson$!: Observable<Lesson | null>;
    error$: Observable<string | null>;

    bookings = signal<LessonBooking[]>([])

    // Attendance data
    attendances: Attendance[] = [];
    attendanceTableData: AttendanceTableData[] = [];

    // Related data
    students: Student[] = [];
    materials: Material[] = [];
    notes: LessonNote[] = [];

    // Tab view properties
    currentView: string = 'overview'; // Default view is overview
    viewOptions = [
        { label: 'Visão Geral', value: 'overview' },
        { label: 'Alunos', value: 'students' },
        { label: 'Presença', value: 'attendance' },
        { label: 'Materiais', value: 'materials' },
        { label: 'Anotações', value: 'notes' },
    ];

    // Loading states for related data
    loading$: Observable<boolean> = of(false);
    loadingAttendances$: Observable<boolean> = of(false)
    loadingStudents$: Observable<boolean> = of(false);
    loadingMaterials$: Observable<boolean> = of(false);

    // Attendance status options for dropdown
    attendanceStatusOptions = [
        { label: 'Presente', value: AttendanceStatus.PRESENT },
        { label: 'Ausente', value: AttendanceStatus.ABSENT },
        { label: 'Pendente', value: AttendanceStatus.BOOKED }
    ];

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store,
        private location: Location,
    ) {
        // Initialize observables from store

        // Errors states
        this.lesson$ = this.store.select(selectSelectedLesson) as Observable<Lesson | null>;
        this.error$ = this.store.select(selectError);
        this.error$ = this.store.select(selectAttendancesError)

        // Loadings states
        this.loading$ = this.store.select(selectLoadingLessons);
        this.loadingAttendances$ = this.store.select(selectAttendancesLoading)
        this.loadingMaterials$ = this.store.select(selectLoadingMaterials)
        this.loadingStudents$ = this.store.select(selectStudentAnyLoading)


        this.lesson$.subscribe((v) => {
            this.quickActions = [
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
                    handler: () => this.rescheduleLesson()
                },
                {
                    label: 'Cancelar Aula',
                    icon: 'pi-times',
                    iconColor: 'text-red-600',
                    bgColor: 'bg-red-100',
                    handler: () => this.cancelLesson()
                },
                {
                    label: 'Enviar Notificação',
                    icon: 'pi-send',
                    iconColor: 'text-cyan-600',
                    bgColor: 'bg-cyan-100',
                    handler: () => this.sendNotification()
                }
            ];
        })
    }

    ngOnInit() {
        // Get the lesson ID from the route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    // Dispatch action to load the lesson
                    this.store.dispatch(lessonsActions.loadLesson({ id }));
                    this.store.dispatch(lessonsActions.loadLessonBookings({ lessonId: id }));

                    this.store.dispatch(attendancesActions.loadAttendancesByLesson({ lessonId: id }));
                    // Subscribe to attendances for this lesson
                    this.store.select(selectAttendancesByLesson(id))
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((attendances) => {
                            this.attendances = attendances;
                            this.attendanceTableData = this.buildAttendanceTableData(attendances);
                        });

                    this.store.select(selectBookings).subscribe((v: any) => {
                        this.bookings.set(v?.bookings || [])
                    })

                    // Load lesson materials using entity LESSON via NgRx
                    this.store.dispatch(MaterialActions.loadMaterialsByEntity({ entity: 'LESSON', entityId: id }));
                    this.store.select(selectMaterialsByEntityAndId('LESSON', id))
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((materials) => {
                            this.materials = materials;
                        });
                }
            });
    }

    ngOnDestroy(): void {
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
        return this.students.length;
    }

    public getAttendanceRate(): number {
        if (this.attendances.length === 0) return 0;

        const presentCount = this.attendances.filter(attendance => attendance.present).length;
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
        // Implement attendance marking logic
    }

    public addMaterial(lesson: Lesson): void {

        if (lesson.id) {
            this.router.navigate(['/schoolar/materials/create'], {
                queryParams: { entity: "LESSON", entityId: lesson.id }
            });
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

    // Status helper methods
    public getLessonStatusText(lesson: Lesson): string {
        if (!lesson) return 'Desconhecido';

        switch (lesson.status) {
            case LessonStatus.AVAILABLE:
                return 'Disponível';
            case LessonStatus.BOOKED:
                return 'Agendada';
            case LessonStatus.COMPLETED:
                return 'Concluída';
            case LessonStatus.CANCELLED:
                return 'Cancelada';
            case LessonStatus.POSTPONED:
                return 'Adiada';
            case LessonStatus.OVERDUE:
                return 'Lecionada';
            default:
                return 'Disponível';
        }
    }

    public getLessonStatusSeverity(lesson: Lesson): string {
        if (!lesson) return 'secondary';

        switch (lesson.status) {
            case LessonStatus.AVAILABLE:
                return 'success';
            case LessonStatus.COMPLETED:
                return 'info';
            case LessonStatus.BOOKED:
                return 'warning';
            case LessonStatus.CANCELLED:
                return 'danger';
            case LessonStatus.POSTPONED:
                return 'warning';
            case LessonStatus.OVERDUE:
                return 'info';
            default:
                return 'secondary';
        }
    }

    // Attendance table data helper
    public getAttendanceTableData(): AttendanceTableData[] {
        return this.attendanceTableData;
    }

    private buildAttendanceTableData(attendances: Attendance[]): AttendanceTableData[] {
        return attendances.map(attendance => {
            // Create a student object from the attendance data
            const student: Student = {
                id: attendance.studentId,
                code: 0, // Default code
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
                center: {} as any, // Default center
                level: {} as any, // Default level
                enrollmentDate: attendance.createdAt,
                createdAt: attendance.createdAt,
                updatedAt: attendance.updatedAt
            };

            return {
                student,
                attendance: attendance,
                present: attendance.present,
                observations: attendance.justification
            };
        });
    }

    // Enhanced action methods
    public duplicateLesson(lesson: Lesson): void {
        if (lesson?.id) {
            console.log('Duplicating lesson:', lesson.id);
            // Implement duplication logic
        }
    }

    public editLesson(lesson: Lesson): void {
        if (lesson?.id) {
            this.router.navigate(['/schoolar/lessons/edit', lesson.id]);
        }
    }

    public exportLesson(lesson: Lesson): void {
        if (lesson?.id) {
            console.log('Exporting lesson:', lesson.id);
            // Implement export logic
        }
    }

    public printLesson(lesson: Lesson): void {
        if (lesson?.id) {
            console.log('Printing lesson:', lesson.id);
            // Implement print logic
        }
    }

    public configureOnlineLink(lesson: Lesson): void {
        if (lesson?.id) {
            console.log('Configuring online link for lesson:', lesson.id);
            // Implement online link configuration
        }
    }

    public addStudent(): void {
        console.log('Adding student to lesson');
        // Implement add student logic
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
        // Implement mark all present logic
    }

    public editAttendance(attendanceData: AttendanceTableData): void {
        console.log('Editing attendance for student:', attendanceData.student.id);
        // Implement edit attendance logic
    }

    public updateAttendanceStatus(attendanceData: AttendanceTableData, newStatus: AttendanceStatus, justification: string): void {
        if (!attendanceData.attendance.id) {
            console.error('Attendance ID is required for update');
            return;
        }

        const statusUpdate: AttendanceStatusUpdate = {
            status: newStatus,
            justification: justification
        };

        // Dispatch NgRx action to update attendance status
        this.store.dispatch(attendancesActions.updateAttendanceStatus({ id: attendanceData.attendance.id, statusUpdate }));
    }

    public onAttendanceStatusChange(attendanceData: AttendanceTableData, newStatus: AttendanceStatus): void {
        // Generate appropriate justification based on status
        let justification = '';
        switch (newStatus) {
            case AttendanceStatus.PRESENT:
                justification = 'Present';
                break;
            case AttendanceStatus.ABSENT:
                justification = 'Absent';
                break;
            case AttendanceStatus.BOOKED:
                justification = 'Automatically created when lesson was booked';
                break;
        }

        this.updateAttendanceStatus(attendanceData, newStatus, justification);
    }

    public downloadMaterial(material: Material): void {
        if (material.id) {
            console.log('Downloading material:', material.id);
            // Implement download logic
        }
    }

    public editMaterial(material: Material): void {
        if (material.id) {
            console.log('Editing material:', material.id);
            // Implement edit material logic
        }
    }

    public removeMaterial(material: Material): void {
        if (material.id) {
            console.log('Removing material:', material.id);
            // Implement remove material logic
        }
    }

    public addNote(): void {
        console.log('Adding new note');
        // Implement add note logic
    }

    public editNote(note: LessonNote): void {
        console.log('Editing note:', note.id);
        // Implement edit note logic
    }

    public removeNote(note: LessonNote): void {
        console.log('Removing note:', note.id);
        // Implement remove note logic
    }

    protected LessonStatus = LessonStatus;
    protected AttendanceStatus = AttendanceStatus;

    // Attendance status helper methods
    public getAttendanceStatusText(status: string): string {
        switch (status) {
            case AttendanceStatus.PRESENT:
                return 'Presente';
            case AttendanceStatus.ABSENT:
                return 'Ausente';
            case AttendanceStatus.BOOKED:
                return 'Pendente';
            default:
                return 'Desconhecido';
        }
    }

    public getAttendanceStatusSeverity(status: string): string {
        switch (status) {
            case AttendanceStatus.PRESENT:
                return 'success';
            case AttendanceStatus.ABSENT:
                return 'danger';
            case AttendanceStatus.BOOKED:
                return 'warning';
            default:
                return 'secondary';
        }
    }
}
