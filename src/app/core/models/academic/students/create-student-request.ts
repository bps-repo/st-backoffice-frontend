export interface CreateStudentRequest {
    identificationNumber: string
    firstname: string;
    lastname: string;
    gender: string; // 'MALE' or 'FEMALE'
    birthdate: string; // YYYY-MM-DD
    email: string;
    password: string;
    photo?: string;
    phone: string;
    centerId: string;
    emergencyContactNumber?: string;
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    academicBackground: string; // e.g., 'SECONDARY_SCHOOL'
    province: string;
    municipality: string;
    notes?: string;
    vip?: boolean;
    vipTeacherId?: string;
    directChatEnabled?: boolean;
    fixedDateClasses?: boolean;
}
