import {Pipe, PipeTransform} from '@angular/core';
import {PaymentMethod} from '../../core/models/payment/installment';

@Pipe({name: 'paymentMethodLabel', standalone: true, pure: true})
export class PaymentMethodLabelPipe implements PipeTransform {
    transform(method: string | null | undefined): string {
        if (!method) return '-';
        switch (method) {
            case PaymentMethod.CREDIT_CARD:    return 'Cartão de Crédito';
            case PaymentMethod.DEBIT_CARD:     return 'Cartão de Débito';
            case PaymentMethod.CASH:           return 'Dinheiro';
            case PaymentMethod.BANK_TRANSFER:  return 'Transferência Bancária';
            case PaymentMethod.MULTICAIXA:     return 'Multicaixa';
            case PaymentMethod.MULTICAIXA_EXPRESS: return 'Multicaixa Express';
            case PaymentMethod.CHECK:          return 'Cheque';
            default:                           return method.replace(/_/g, ' ');
        }
    }
}
