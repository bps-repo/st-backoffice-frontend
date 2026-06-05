export type FinanceInvoiceDocumentType = 'PROFORMA' | 'RECEIPT' | 'GENERAL';

export type FinanceInvoicePaymentStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID';

export interface FinanceInvoiceReportRow {
    invoiceId: string;
    invoiceNumber: string;
    documentType: FinanceInvoiceDocumentType;
    issueDate: string;
    dueDate?: string;
    customerId: string;
    customerName: string;
    customerCode: string;
    contractId: string;
    contractCode: string;
    contractStatus: string;
    centerId: string;
    centerName: string;
    subtotal: number;
    discountAmount: number;
    amount: number;
    paidAmount: number;
    pendingAmount: number;
    paymentStatus: FinanceInvoicePaymentStatus;
}

export interface FinanceInvoicesReportFilter {
    dateFrom: string;
    dateTo: string;
    centerId?: string;
    documentType?: FinanceInvoiceDocumentType[];
    paymentStatus?: FinanceInvoicePaymentStatus[];
    page?: number;
    size?: number;
}
