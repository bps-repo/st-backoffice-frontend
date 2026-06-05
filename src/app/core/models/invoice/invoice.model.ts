import { EntityPayment, PaymentMethod } from '../payment/installment';

export const INVOICE_PAYMENT_METHOD_OPTIONS: { label: string; value: PaymentMethod }[] = [
    { label: 'Dinheiro', value: PaymentMethod.CASH },
    { label: 'Transferência Bancária', value: PaymentMethod.BANK_TRANSFER },
    { label: 'Cartão de Débito', value: PaymentMethod.DEBIT_CARD },
    { label: 'Cartão de Crédito', value: PaymentMethod.CREDIT_CARD },
];

export interface Invoice {
    total: number;
    subtotal: number;
    client_phone: string;
    client_email: string;
    client_name: string;
    id?: number;
    invoice_number: string;
    client: string;
    amount: number;
    total_tax: number;
    emission_date: Date;
    due_date: Date;
    status: string;
    observations?: string;
    payment_method: string;
    notes?: string
    retention?: number;
    items: InvoiceItem[];
}

export interface InvoiceListItem {
    id: string;
    invoiceNumber: string;
    documentType: string;
    issueDate: string;
    contractId: string;
    contractCode: string;
    contractStatus: string;
    centerId: string;
    description: string;
    notes: string;
    paymentSchedule: string;
    subtotal: number;
    discountAmount: number;
    amount: number;
    paidAmount: number;
    pendingAmount: number;
    paymentStatus: string;
    paid: boolean;
    active: boolean;
    items: InvoiceListItemProduct[];
    customer: InvoiceCustomer;
}


export interface InvoiceCustomer {
    id: string;
    code: number;
    fullName: string;
    email: string;
    phone: string;
    centerId: string;
    centerName: string;
}


export interface InvoiceListItemProduct {
    id: string;
    productName?: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    totalAmount: number;
}

export interface InvoiceDetail {
    id: string;
    invoiceNumber: string;
    documentType: string;
    issueDate: string;
    customerId: string;
    customer: {
        id: string;
        code: number;
        fullName: string;
        email: string;
        phone: string;
        centerId: string;
        centerName: string;
    };
    contractId: string;
    contractCode: string;
    contractStatus: string;
    centerId: string;
    description: string;
    notes: string;
    paymentSchedule: string;
    paymentMethod?: PaymentMethod | string;
    subtotal: number;
    discountAmount: number;
    amount: number;
    paidAmount: number;
    pendingAmount: number;
    paymentStatus: string;
    paid: boolean;
    active: boolean;
    items: InvoiceListItemProduct[];
}

export type InvoiceDocumentType = 'PROFORMA' | 'RECEIPT' | 'GENERAL';

export const INVOICE_DOCUMENT_TYPE_OPTIONS: { label: string; value: InvoiceDocumentType }[] = [
    { label: 'Proforma', value: 'PROFORMA' },
    { label: 'Recibo', value: 'RECEIPT' },
    { label: 'Geral', value: 'GENERAL' },
];

export function getInvoiceDocumentTypeLabel(type: InvoiceDocumentType | string | undefined): string {
    return INVOICE_DOCUMENT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type ?? '-';
}

export type CreateInvoiceAction = 'SAVE' | 'SAVE_AND_GENERATE_INVOICE' | 'SAVE_AND_GENERATE_PAYMENT';

export interface CreateInvoiceRequest {
    action: CreateInvoiceAction;
    issueDate: string;
    customerId: string;
    centerId: string;
    description: string;
    notes: string;
    paymentMethod: PaymentMethod;
    discountAmount: number;
    items: CreateInvoiceItemRequest[];
}

export interface CreateInvoiceItemRequest {
    centerProductId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
}

export interface CreateInvoicePaymentRequest {
    paymentMethod: PaymentMethod;
    amount: number;
}

export type InvoicePayment = EntityPayment;

export interface InvoiceItem {
    tax_rate: number;
    total: number;
    unit_price: number;
    quantity: number;
    product_id: boolean;
    description: string;
    id?: number;
    invoice_id?: number;
    product: string;
    price: number;
    discount: number;
    vat: number;
    amount: number;
}

export enum InvoiceStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled',
    OVERDUE = 'overdue'
}
