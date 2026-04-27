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
    productName: string;
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
