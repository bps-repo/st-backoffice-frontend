import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {SplitButtonModule} from 'primeng/splitbutton';
import {GlobalTable, TableColumn} from 'src/app/shared/components/tables/global-table/global-table.component';
import {CONTRACTS_COLUMNS, CONTRACTS_GLOBAL_FILTERS} from "../contracts.cons";

@Component({
    selector: 'app-general',
    imports: [
        CommonModule,
        GlobalTable,
        FormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        SplitButtonModule
    ],
    templateUrl: './list.component.html'
})
export class ListComponent {
    contracts: any[] = [];
    columns: TableColumn[] = CONTRACTS_COLUMNS;
    globalFilters = CONTRACTS_GLOBAL_FILTERS;
    loading = false

    constructor(private readonly router: Router) {
    }

    navigateToCreateContract() {
        this.router.navigate(['/finances/contracts/create']).then();
    }
}
