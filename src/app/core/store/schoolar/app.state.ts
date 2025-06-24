import {EntityState} from '@ngrx/entity';

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
