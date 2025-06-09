export interface Contract {
    id?: string;
    studentId: string;
    startDate: string;
    endDate: string;
    contractType: string;
    paymentFrequency: string;
    paymentAmount: number;
    status: string;
    terms: string;
    createdAt?: string;
    updatedAt?: string;
}
