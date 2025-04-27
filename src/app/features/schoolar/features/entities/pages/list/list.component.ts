import { Component } from '@angular/core';
import { Company } from 'src/app/core/models/mocks/company';
import { GlobalTable } from 'src/app/shared/components/tables/global-table/global-table.component';
import { COMPANIES } from 'src/app/shared/constants/companies';

@Component({
    selector: 'app-list',
    imports: [GlobalTable],
    templateUrl: './list.component.html'
})
export class ListComponent {
    tableLabel = 'Entidades';
    columns = [
        { field: 'id', header: 'Número' },
        { field: 'name', header: 'Nome' },
        { field: 'phone', header: 'Telefone' },
        { field: 'address', header: 'Endereço' },
        { field: 'students', header: 'Estudantes' },
    ];
    entities: Company[] = COMPANIES;

    globalFilterFields: string[] = [];
}
