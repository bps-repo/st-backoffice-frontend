import {EntityState} from '@ngrx/entity';
import {Lesson} from "../../models/academic/lesson";
import {StudentsState} from "./students/students.state";
import {LessonsState} from "./lessons/lessons.state";

export interface AppState {
    students: StudentsState;
    classes: ClassesState;
    calendars: CalendarsState;
    entities: EntitiesState;
    reviews: ReviewsState;
    materials: MaterialsState;
    certificates: CertificatesState;
    reports: ReportsState;
    settings: SettingsState;
    lessons: LessonsState;
}

export interface ClassesState extends EntityState<Lesson> {
    selectedLessonId: string | null;
    loading: boolean;
    error: string | null;
}

export interface CalendarsState extends EntityState<any> {
    selectedCalendarId: string | null;
    loading: boolean;
    error: string | null;
}

export interface EntitiesState extends EntityState<any> {
    selectedEntityId: string | null;
    loading: boolean;
    error: string | null;
}

export interface ReviewsState extends EntityState<any> {
    selectedReviewId: string | null;
    loading: boolean;
    error: string | null;
}

export interface MaterialsState extends EntityState<any> {
    selectedMaterialId: string | null;
    loading: boolean;
    error: string | null;
}

export interface CertificatesState extends EntityState<any> {
    selectedCertificateId: string | null;
    loading: boolean;
    errors: string | null;
}

export interface ReportsState extends EntityState<any> {
    selectedReportId: string | null;
    loading: boolean;
    error: string | null;
}

export interface SettingsState {
    loading: boolean;
    error: string | null;
    settings: {
        [key: string]: any;
    };
}
