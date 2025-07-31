import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';

@Component({
    selector: 'app-student-payment-tab',
    standalone: true,
    imports: [CommonModule, CardModule, TagModule, ButtonModule, DividerModule],
    templateUrl: './payment.component.html',
})
export class StudentPaymentTabComponent {
    stats = [
        { label: 'Total Pago', value: 'Kz 70 000,00', color: 'text-green-500', bg: 'surface-100' },
        { label: 'Pendente', value: 'Kz 15 000,00', color: 'text-yellow-500', bg: 'surface-100' },
        { label: 'Vencido', value: 'Kz 5 000,00', color: 'text-red-500', bg: 'surface-100' },
        { label: 'Total Curso', value: 'Kz 90 000,00', color: 'text-blue-500', bg: 'surface-100' },
    ];

    payments = [
        {
            mes: 'Mensalidade Janeiro 2024',
            estado: 'Pago',
            cor: 'success',
            valor: 'Kz 15 000,00',
            vencimento: '2024-01-15',
            pagamento: '2024-01-15',
            metodo: 'Multicaixa',
            recibo: 'REC-2024-001',
        },
        {
            mes: 'Mensalidade Fevereiro 2024',
            estado: 'Pago',
            cor: 'success',
            valor: 'Kz 15 000,00',
            vencimento: '2024-02-15',
            pagamento: '2024-02-14',
            metodo: 'Transferência Bancária',
            recibo: 'REC-2024-002',
        },
        {
            mes: 'Mensalidade Abril 2024',
            estado: 'Pendente',
            cor: 'warning',
            valor: 'Kz 15 000,00',
            vencimento: '2024-04-15',
            pagamento: null,
            metodo: null,
            recibo: null,
            acao: 'Pagar Agora',
        },
        {
            mes: 'Taxa de Material Didático',
            estado: 'Vencido',
            cor: 'danger',
            valor: 'Kz 5 000,00',
            vencimento: '2024-04-20',
            pagamento: null,
            metodo: null,
            recibo: null,
            atrasoDias: 452,
            acao: 'Regularizar',
        },
    ];
}
