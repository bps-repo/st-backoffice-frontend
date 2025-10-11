import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy, signal} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {FormsModule} from '@angular/forms';
import {Subject, takeUntil, Observable, combineLatest, of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Location} from '@angular/common';
import {Lesson, LessonBooking} from "../../../../../../core/models/academic/lesson";
import {LessonStatus} from "../../../../../../core/enums/lesson-status";
import {lessonsActions} from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import {selectSelectedLesson, selectLoadingLessons, selectError, selectLessonBookings, selectBookings} from "../../../../../../core/store/schoolar/lessons/lessons.selectors";
import {Student} from "../../../../../../core/models/academic/student";
import {Attendance} from "../../../../../../core/models/academic/attendance";
import {Material} from "../../../../../../core/models/academic/material";
import {StudentService} from "../../../../../../core/services/student.service";
import {AttendanceService} from "../../../../../../core/services/attendance.service";
import {MaterialService} from "../../../../../../core/services/material.service";
import {LessonService} from "../../../../../../core/services/lesson.service";

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
        FormsModule,
    ],
    templateUrl: './lesson-detail.component.html'
})
export class LessonDetailComponent implements OnInit, OnDestroy {
    lesson$!: Observable<Lesson | null>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;

    bookings = signal<LessonBooking[]>([])


    // Related data
    students: Student[] = [];
    attendances: Attendance[] = [];
    materials: Material[] = [];
    notes: LessonNote[] = [];

    // Tab view properties
    currentView: string = 'overview'; // Default view is overview
    viewOptions = [
        {label: 'Visão Geral', value: 'overview'},
        {label: 'Alunos', value: 'students'},
        {label: 'Presença', value: 'attendance'},
        {label: 'Materiais', value: 'materials'},
        {label: 'Anotações', value: 'notes'},
    ];

    // Loading states for related data
    loadingStudents = false;
    loadingAttendances = false;
    loadingMaterials = false;

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store,
        private location: Location,
        private studentService: StudentService,
        private attendanceService: AttendanceService,
        private materialService: MaterialService,
        private lessonService: LessonService
    ) {
        // Initialize observables from store
        this.lesson$ = this.store.select(selectSelectedLesson) as Observable<Lesson | null>;
        this.loading$ = this.store.select(selectLoadingLessons);
        this.error$ = this.store.select(selectError);
    }

        ngOnInit() {
        // Get the lesson ID from the route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    // Dispatch action to load the lesson
                    this.store.dispatch(lessonsActions.loadLesson({id}));
                    this.store.dispatch(lessonsActions.loadLessonBookings({ lessonId: id }))

                    this.store.select(selectBookings).subscribe((v: any) =>{
                        console.log("bookings", v.bookings);
                        this.bookings.set(v.bookings)
                    })


                    // Load related data
                    this.loadRelatedData(id);
                }
            });

        // Subscribe to lesson changes and provide fallback mock data
        this.lesson$.pipe(takeUntil(this.destroy$)).subscribe(lesson => {
            if (!lesson) {
                // If no lesson is loaded, we could set a default mock lesson here
                // For now, we'll let the template handle the null case
            }
        });

        // Initialize mock notes data
        this.initializeMockNotes();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Initialize mock notes data
     */
    private initializeMockNotes(): void {
        this.notes = [
            {
                id: '1',
                title: 'Aula de Conversação',
                content: 'Os alunos demonstraram boa compreensão dos tópicos discutidos. João precisa melhorar a pronúncia.',
                createdAt: new Date('2025-01-21T10:30:00'),
                createdBy: 'Prof. Maria Silva'
            },
            {
                id: '2',
                title: 'Material Adicional',
                content: 'Sugerir exercícios de listening para a próxima aula.',
                createdAt: new Date('2025-01-21T11:00:00'),
                createdBy: 'Prof. Maria Silva'
            }
        ];
    }

    /**
     * Load related data for the lesson
     */
    private loadRelatedData(lessonId: string): void {
        // Load students for this lesson
        this.loadingStudents = true;
        this.lessonService.getLessonBookings(lessonId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (bookings) => {
                    // Extract student IDs from bookings and load student details
                    const studentIds = bookings.map(booking => booking.studentId).filter(id => id);
                    if (studentIds.length > 0) {
                        this.loadStudentsByIds(studentIds);
                    } else {
                        // Use mock data if no bookings found
                        this.loadingStudents = false;
                    }
                },
                error: () => {
                    // Use mock data on error
                    this.loadingStudents = false;
                }
            });

        // Load attendances for this lesson
        this.loadingAttendances = true;
        // For now, we'll load all attendances and filter by lesson - in a real app, you might have a specific endpoint
        this.attendanceService.getAttendances()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (allAttendances) => {
                    // Filter attendances by lesson ID (assuming attendance has lessonId field)
                    this.attendances = allAttendances.filter(attendance =>
                        attendance.lessonId === lessonId
                    );
                    this.loadingAttendances = false;
                },
                error: () => {
                    this.loadingAttendances = false;
                }
            });

        // Load materials for this lesson
        this.loadingMaterials = true;
        this.lesson$.pipe(takeUntil(this.destroy$)).subscribe(lesson => {
            if (lesson?.materialsIds && lesson.materialsIds.length > 0) {
                this.loadMaterialsByIds(lesson.materialsIds);
            } else {
                // Use mock data if no materials found
                this.loadingMaterials = false;
            }
        });
    }

    /**
     * Load students by their IDs
     */
    private loadStudentsByIds(studentIds: string[]): void {
        // For now, we'll load all students and filter - in a real app, you might have a bulk endpoint
        this.studentService.getStudents()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (allStudents) => {
                    this.students = allStudents.filter(student =>
                        studentIds.includes(student.id || '')
                    );

                    this.loadingStudents = false;
                },
                error: () => {
                    this.loadingStudents = false;
                }
            });
    }

    /**
     * Load materials by their IDs
     */
    private loadMaterialsByIds(materialIds: string[]): void {
        // For now, we'll load all materials and filter - in a real app, you might have a bulk endpoint
        this.materialService.getMaterials()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (allMaterials) => {
                    this.materials = allMaterials.filter(material =>
                        materialIds.includes(material.id || '')
                    );

                    this.loadingMaterials = false;
                },
                error: () => {
                    this.loadingMaterials = false;
                }
            });
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
        if (!lesson.teacher) return 'MS';

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
            this.router.navigate(['/schoolar/lessons/materials/add', lesson.id]);
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
            case LessonStatus.BOOKED:
                return 'Reservada';
            case LessonStatus.CANCELLED:
                return 'Cancelada';
            case LessonStatus.POSTPONED:
                return 'Adiada';
            case LessonStatus.OVERDUE:
                return 'Atrasada';
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
                return 'danger';
            default:
                return 'secondary';
        }
    }

    // Attendance table data helper
    public getAttendanceTableData(): AttendanceTableData[] {
        return this.students.map(student => {
            const attendance = this.attendances.find(att =>
                att.student && att.student.id === student.id
            );

            return {
                student,
                attendance: attendance || {} as Attendance,
                present: attendance?.present || false,
                observations: attendance?.justification
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
}
