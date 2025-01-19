import { Component } from '@angular/core';
import { Company } from 'src/app/core/models/company';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { COMPANIES } from 'src/app/shared/constants/companies';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [GlobalTableComponent],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
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
