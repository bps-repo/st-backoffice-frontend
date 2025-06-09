import {Invoice, InvoiceStatus} from "../../../../core/models/invoice/invoice.model";

export const mockInvoice: Invoice = {
    total: 1650,
    subtotal: 1500,
    client_phone: '+1-555-0123',
    client_email: 'john.doe@example.com',
    client_name: 'John Doe',
    id: 1,
    invoice_number: 'INV-2025-001',
    client: 'John Doe Enterprises',
    amount: 1500,
    total_tax: 150,
    emission_date: new Date('2025-05-25'),
    due_date: new Date('2025-06-25'),
    status: InvoiceStatus.PENDING,
    observations: 'First-time client, 10% discount applied',
    payment_method: 'Credit Card',
    notes: 'Please contact accounting if you have any questions.',
    retention: 50,
    items: [
        {
            id: 1,
            invoice_id: 1,
            product: 'Web Development Service',
            price: 1000,
            discount: 100,
            vat: 100,
            amount: 1,
            tax_rate: 0,
            total: 0,
            unit_price: 0,
            quantity: 0,
            product_id: false,
            description: ""
        },
        {
            id: 2,
            invoice_id: 1,
            product: 'Hosting Service',
            price: 500,
            discount: 0,
            vat: 50,
            amount: 1,
            tax_rate: 0,
            total: 0,
            unit_price: 0,
            quantity: 0,
            product_id: false,
            description: ""
        }
    ]
};
