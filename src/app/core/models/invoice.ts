export interface Invoice {
    id: number;
    code: string;
    price: number;
    date: string;
    dueDate: string;
    customer?: {
        id: number;
        name: string;
    };
    status: string;
    products?: {};
    totalItems: number;
    totalValue: number;
    totalDiscount: number;
    totalTaxes: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate: string;
    shippingAddress: {};
    billingAddress: {};
    shippingCost: number;
    shippingMethod: string;
    shippingDate: string;
    shippingStatus: string;
}

export enum InvocieStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}
