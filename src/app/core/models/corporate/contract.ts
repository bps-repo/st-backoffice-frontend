import { CreateInstallment, Installment } from "../payment/installment";

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

// Student level summary embedded in contract responses
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
    level?: ContractStudentLevelSummary;
    center: ContractStudentCenterSummary;
}

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

export interface ContractFinancialSummary {
    totalAmount: number;
    discountPercent: number;
    finalAmount: number;
    courseMaterialPrice?: number | null;
    courseMaterialPaid: boolean;
    currency: string;
    levelPrice?: number;
}

export enum ContractStatus {
    ACTIVE = 'ACTIVE',
    HOLD = 'HOLD',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    OVERDUE = 'OVERDUE',
    EXTENDED_PAYMENT = 'EXTENDED_PAYMENT',
}

export enum ContractType {
    STANDARD = 'STANDARD',
    VIP = 'VIP',
}

export enum CourseType {
    LANGUAGE = 'LANGUAGE',
    CATALOG = 'CATALOG',
}

export interface Contract {
    id: string;
    code: string;
    deleted?: boolean;
    student: Student;
    seller?: Seller;
    startDate: string;
    endDate?: string;
    status: ContractStatus;
    contractType: ContractType;
    courseType?: CourseType;
    productId?: string;
    productName?: string;
    materialProductId?: string;
    materialProductName?: string;
    financial: ContractFinancialSummary;
    installments?: Installment[];
    notes?: string;
}

export interface ContractListFilter {
    status?: ContractStatus;
    contractType?: ContractType;
    courseType?: CourseType;
    studentName?: string;
    page?: number;
    size?: number;
    sort?: string;
}

export interface CreateStudentContractRequest {
    studentId: string;
    sellerId?: string;
    productId: string;
    materialProductId?: string;
    companyId?: string;
    durationMonths?: number;
    amount: number;
    enrollmentFee: number;
    enrollmentFeePaid: boolean;
    discountPercent: number;
    unitPrice: number;
    contractLevel?: {
        id?: string;
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
    contractType: ContractType;
    numberOfInstallments: number;
    firstInstallmentDate?: string;
    customInstallments?: CreateInstallment[];
}
