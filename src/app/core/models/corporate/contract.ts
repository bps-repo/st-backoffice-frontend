
export interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    phone?: string;
    identificationNumber?: string;
    roleName: string;
    photo?: string;
    birthdate?: string;
    dateOfBirth?: string;
    gender: string;
    status: string;
    permissions?: any[];
}

export interface Center {
    id: string;
    name: string;
    email: string;
    address?: string;
    city?: string;
    phone: string;
    active: boolean;
    serviceIds?: any;
    createdAt: string;
    updatedAt: string;
}

export interface Unit {
    id: string;
    name: string;
    description: string;
    orderUnit: string;
    levelId: string;
    generic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Level {
    id: string;
    name: string;
    description: string;
    duration: number;
    maximumUnits: number;
    order?: any;
    units: Unit[];
    createdAt: string;
    updatedAt: string;
}

export interface Student {
    id: string;
    code: number;
    user: User;
    enrollmentDate: string;
    status: string;
    center: Center;
    level?: Level;
    currentUnit?: Unit;
    levelProgressPercentage: number;
    vip: boolean;
    vipTeacherId?: string;
    directChatEnabled: boolean;
    fixedDateClasses: boolean;
    emergencyContactNumber: string;
    emergencyContactName: string;
    emergencyContactRelationship: string;
    academicBackground: string;
    province: string;
    municipality: string;
    notes?: string;
    unitProgressesIds?: any;
    certificatesIds?: any;
    contractsIds?: any;
    attendancesIds?: any;
    createdAt: string;
    updatedAt: string;
}

export interface Seller {
    id: string;
    user: User;
    centerId: string;
    hiringDate: string;
    resignationDate?: string;
    wage: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContractLevel {
    id?: string;
    levelId: string;
    productId: string;
    duration: number;
    levelPrice: number;
    courseMaterialPrice: number;
    levelOrder: number;
    offerType: string;
    registrationFeeType: string;
    finalLevelPrice?: number;
    finalCourseMaterialPrice?: number;
    courseMaterialPaid: boolean;
    includeCourseMaterial: boolean;
    includeRegistrationFee: boolean;
    status: string;
    contractType: string;
    startDate?: string;
    endDate?: string;
    notes?: string;
}

export interface Installment {
    id: string;
    installmentNumber: number;
    dueDate: string;
    amount: number;
    status: 'PENDING_PAYMENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

export interface Contract {
    id: string;
    student: Student;
    seller: Seller;
    startDate: string;
    endDate?: string;
    amount?: number;
    discountPercent: number;
    status: 'ACTIVE' | 'HOLD' | 'CANCELLED' | 'COMPLETED';
    contractType: 'STANDARD' | 'VIP' | 'PROMOTIONAL' | 'CUSTOM';
    contractLevels: ContractLevel[];
    installments?: Installment[];
    numberOfInstallments: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    // Legacy support - these might still be returned by the API for backward compatibility
    levels?: ContractLevel[]; // Alias for contractLevels
}

export interface CreateStudentContractRequest {
    studentId: string;
    sellerId: string;
    amount: number;
    enrollmentFee: number;
    enrollmentFeePaid: boolean;
    discountPercent: number;
    unitPrice: number;
    contractLevel: {
        levelId: string;
        duration: number;
        levelPrice: number;
        courseMaterialPrice: number;
        finalCourseMaterialPrice: number;
        courseMaterialPaid: boolean;
        includeRegistrationFee: boolean;
        notes?: string;
    };
    includeRegistrationFee: boolean;
    numberOfLevelsOffered: number;
    notes?: string;
    contractType: 'STANDARD' | 'VIP' | 'PROMOTIONAL' | 'CUSTOM';
    numberOfInstallments: number;
}

