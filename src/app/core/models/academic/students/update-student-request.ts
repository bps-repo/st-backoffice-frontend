import {LegalGuardian} from './legal-guardian';

export interface UpdateStudentRequest {
    enrollmentDate?: string;
    status?: string;
    centerId?: string;
    levelId?: string;
    currentUnitId?: string;
    levelProgressPercentage?: number;
    emergencyContactNumber?: string | null;
    emergencyContactName?: string | null;
    emergencyContactRelationship?: string | null;
    academicBackground?: string | null;
    province?: string | null;
    municipality?: string | null;
    notes?: string | null;
    legalGuardians?: LegalGuardian[];
}
