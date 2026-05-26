import {Pipe, PipeTransform} from '@angular/core';
import {PaymentEntityType} from '../../core/models/payment/installment';

@Pipe({name: 'entityTypeSeverity', standalone: true, pure: true})
export class EntityTypeSeverityPipe implements PipeTransform {
    transform(type: string): string {
        switch (type) {
            case PaymentEntityType.INSTALLMENT: return 'info';
            case PaymentEntityType.CONTRACT:    return 'success';
            default:                            return 'secondary';
        }
    }
}
