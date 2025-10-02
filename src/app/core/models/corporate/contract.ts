
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

// New API student shape for contracts
export interface ContractStudentLevelSummary {
    id: string;
    name: string;
    order: number;
}

export interface ContractStudentCenterSummary {
    id: string;
    name: string;
}

export interface Student {
    id: string;
    code: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    level: ContractStudentLevelSummary;
    center: ContractStudentCenterSummary;
}

// New API seller shape for contracts
export interface Seller {
    id: string;
    name: string;
    email: string;
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

export interface ContractFinancialSummary {
    totalAmount: number;
    discountPercent: number;
    finalAmount: number;
    courseMaterialPrice: number | null;
    courseMaterialPaid: boolean;
    currency: string;
}

export interface Contract {
    id: string;
    student: Student;
    seller: Seller;
    startDate: string;
    endDate?: string;
    contractNumber: string | null;
    financial: ContractFinancialSummary;
    amount?: number; // Deprecated: use financial.totalAmount
    discountPercent: number; // Deprecated: use financial.discountPercent
    status: 'ACTIVE' | 'HOLD' | 'CANCELLED' | 'COMPLETED';
    contractType: 'STANDARD' | 'VIP' | 'PROMOTIONAL' | 'CUSTOM';
    contractLevels: ContractLevel[];
    installments?: Installment[];
    numberOfInstallments: number;
    notes?: string;
    createdAt?: string | null;
    updatedAt?: string | null;
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

