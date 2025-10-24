import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Sale, SaleFilter, SaleStatistics } from '../models/finance/sale.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    private apiUrl = `${environment.apiUrl}/sales`;

    constructor(private http: HttpClient) {}

    // Get all sales with optional filtering
    getSales(filter?: SaleFilter): Observable<Sale[]> {
        // For now, return mock data
        return of(this.getMockSales()).pipe(
            delay(1000),
            map(sales => this.filterSales(sales, filter))
        );
    }

    // Get a single sale by ID
    getSaleById(id: string): Observable<Sale | null> {
        // For now, return mock data
        return of(this.getMockSales().find(sale => sale.id === id) || null).pipe(
            delay(500)
        );
    }

    // Create a new sale
    createSale(sale: Omit<Sale, 'id' | 'dates' | 'history'>): Observable<Sale> {
        const newSale: Sale = {
            ...sale,
            id: Date.now().toString(),
            dates: {
                created: new Date().toISOString(),
                lastUpdate: new Date().toISOString()
            },
            history: [{
                action: 'Criação da venda',
                description: 'Venda criada no sistema',
                timestamp: new Date().toISOString()
            }]
        };

        return of(newSale).pipe(delay(1000));
    }

    // Update an existing sale
    updateSale(id: string, updates: Partial<Sale>): Observable<Sale> {
        return this.getSaleById(id).pipe(
            map(sale => {
                if (!sale) {
                    throw new Error('Sale not found');
                }
                return {
                    ...sale,
                    ...updates,
                    dates: {
                        ...sale.dates,
                        lastUpdate: new Date().toISOString()
                    }
                };
            }),
            delay(500)
        );
    }

    // Delete a sale
    deleteSale(id: string): Observable<boolean> {
        return of(true).pipe(delay(500));
    }

    // Get sales statistics
    getSalesStatistics(): Observable<SaleStatistics> {
        const sales = this.getMockSales();
        const totalSales = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.product.total, 0);
        const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

        const salesByType: { [key: string]: number } = {};
        const salesByStatus: { [key: string]: number } = {};
        const salesByMonth: { [key: string]: number } = {};

        sales.forEach(sale => {
            // Count by type
            salesByType[sale.product.type] = (salesByType[sale.product.type] || 0) + 1;

            // Count by status
            salesByStatus[sale.payment.status] = (salesByStatus[sale.payment.status] || 0) + 1;

            // Count by month
            const month = new Date(sale.dates.created).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            salesByMonth[month] = (salesByMonth[month] || 0) + 1;
        });

        return of({
            totalSales,
            totalRevenue,
            averageSaleValue,
            salesByType,
            salesByStatus,
            salesByMonth
        }).pipe(delay(800));
    }

    // Filter sales based on criteria
    private filterSales(sales: Sale[], filter?: SaleFilter): Sale[] {
        if (!filter) return sales;

        return sales.filter(sale => {
            // Search term filter
            if (filter.searchTerm) {
                const searchLower = filter.searchTerm.toLowerCase();
                const matchesSearch =
                    sale.client.name.toLowerCase().includes(searchLower) ||
                    sale.client.email.toLowerCase().includes(searchLower) ||
                    sale.product.name.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Type filter
            if (filter.type && sale.product.type !== filter.type) {
                return false;
            }

            // Status filter
            if (filter.status && sale.payment.status !== filter.status) {
                return false;
            }

            // Date range filter
            if (filter.dateFrom) {
                const saleDate = new Date(sale.dates.created);
                const fromDate = new Date(filter.dateFrom);
                if (saleDate < fromDate) return false;
            }

            if (filter.dateTo) {
                const saleDate = new Date(sale.dates.created);
                const toDate = new Date(filter.dateTo);
                if (saleDate > toDate) return false;
            }

            return true;
        });
    }

    // Mock data for development
    private getMockSales(): Sale[] {
        return [
            {
                id: '1',
                client: {
                    name: 'Maria Silva',
                    email: 'maria@email.com',
                    phone: '+244 123 456 789'
                },
                product: {
                    type: 'Livro',
                    name: 'Livro English Course Level 1',
                    quantity: 2,
                    unitPrice: 2500.00,
                    total: 5000.00
                },
                payment: {
                    method: 'Transferência',
                    status: 'Pago',
                    reference: 'REF001'
                },
                dates: {
                    created: '2024-01-15T10:00:00Z',
                    lastUpdate: '2024-01-15T10:00:00Z',
                    paidAt: '2024-01-15T10:00:00Z'
                },
                history: [
                    {
                        action: 'Criação da venda',
                        description: 'Venda criada no sistema Por: Maria Santos',
                        timestamp: '2024-01-15T10:00:00Z',
                        userName: 'Maria Santos'
                    },
                    {
                        action: 'Pagamento confirmado',
                        description: 'Status alterado para \'Pago\' Por: João Silva',
                        timestamp: '2024-01-15T10:00:00Z',
                        userName: 'João Silva'
                    }
                ]
            },
            {
                id: '2',
                client: {
                    name: 'João Santos',
                    email: 'joao@email.com',
                    phone: '+244 987 654 321'
                },
                product: {
                    type: 'Certificado',
                    name: 'Certificado de Conclusão',
                    quantity: 1,
                    unitPrice: 1500.00,
                    total: 1500.00
                },
                payment: {
                    method: 'Dinheiro',
                    status: 'Pendente'
                },
                dates: {
                    created: '2024-01-14T14:30:00Z',
                    lastUpdate: '2024-01-14T14:30:00Z'
                },
                history: [
                    {
                        action: 'Criação da venda',
                        description: 'Venda criada no sistema Por: Ana Costa',
                        timestamp: '2024-01-14T14:30:00Z',
                        userName: 'Ana Costa'
                    }
                ]
            },
            {
                id: '3',
                client: {
                    name: 'Ana Costa',
                    email: 'ana@email.com',
                    phone: '+244 555 123 456'
                },
                product: {
                    type: 'Declaração',
                    name: 'Declaração de Frequência',
                    quantity: 1,
                    unitPrice: 500.00,
                    total: 500.00
                },
                payment: {
                    method: 'Referência Multicaixa',
                    status: 'Pago',
                    reference: 'REF003'
                },
                dates: {
                    created: '2024-01-13T10:15:00Z',
                    lastUpdate: '2024-01-13T10:15:00Z',
                    paidAt: '2024-01-13T10:15:00Z'
                },
                history: [
                    {
                        action: 'Criação da venda',
                        description: 'Venda criada no sistema Por: Maria Santos',
                        timestamp: '2024-01-13T10:15:00Z',
                        userName: 'Maria Santos'
                    },
                    {
                        action: 'Pagamento confirmado',
                        description: 'Status alterado para \'Pago\' Por: João Silva',
                        timestamp: '2024-01-13T10:15:00Z',
                        userName: 'João Silva'
                    }
                ]
            }
        ];
    }
}
