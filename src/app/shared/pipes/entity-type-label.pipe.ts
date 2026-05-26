import {Pipe, PipeTransform} from '@angular/core';
import {PaymentEntityType} from '../../core/models/payment/installment';

@Pipe({name: 'entityTypeLabel', standalone: true, pure: true})
export class EntityTypeLabelPipe implements PipeTransform {
    transform(type: string): string {
        switch (type) {
            case PaymentEntityType.INSTALLMENT: return 'Parcela';
            case PaymentEntityType.CONTRACT:    return 'Contrato';
            default:                            return type;
        }
    }
}
