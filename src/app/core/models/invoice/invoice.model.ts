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
