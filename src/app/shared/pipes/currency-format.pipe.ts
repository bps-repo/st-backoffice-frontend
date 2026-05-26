import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'currencyFormat', standalone: true, pure: true})
export class CurrencyFormatPipe implements PipeTransform {
    transform(amount: number | null | undefined, currency: string = 'AOA'): string {
        const safe = amount ?? 0;
        try {
            return new Intl.NumberFormat('pt-AO', {style: 'currency', currency}).format(safe);
        } catch {
            return `${safe.toFixed(2)} ${currency}`;
        }
    }
}
