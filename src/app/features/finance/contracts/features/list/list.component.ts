import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {SplitButtonModule} from 'primeng/splitbutton';
import {GlobalTable, TableColumn} from 'src/app/shared/components/tables/global-table/global-table.component';
import {CONTRACTS_COLUMNS, CONTRACTS_GLOBAL_FILTERS} from "../contracts.cons";
import {ContractService} from 'src/app/core/services/contract.service';

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
export class ListComponent implements OnInit {
    contracts: any[] = [];
    columns: TableColumn[] = CONTRACTS_COLUMNS;
    globalFilters = CONTRACTS_GLOBAL_FILTERS;
    loading = false

    constructor(private readonly router: Router, private contractService: ContractService) {}

    ngOnInit(): void {
        this.fetchContracts();
    }

    fetchContracts(): void {
        this.loading = true;
        this.contractService.getContracts().subscribe({
            next: (resp) => {
                // Support both wrapped and direct array responses
                const data = Array.isArray(resp?.data) ? resp.data : (resp?.data?.content ?? resp ?? []);
                this.contracts = (data || []).map((c: any) => this.normalizeRow(c));
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    private normalizeRow(c: any) {
        return {
            code: c.code || c.id || '',
            student: c.studentName || c.student?.name || c.student?.user?.firstname + ' ' + c.student?.user?.lastname || '-',
            course: c.courseName || c.course?.name || c.adultEnglishCourseProductId || '-',
            period: (c.startDate && c.endDate) ? `${c.startDate} - ${c.endDate}` : '-',
            totalValue: c.amount ?? c.total ?? 0,
            installments: c.numberOfInstallments ?? c.installments?.length ?? 0,
            status: c.status || c.contractStatus || 'ACTIVE',
        };
    }

    navigateToCreateContract() {
        this.router.navigate(['/finances/contracts/create']).then();
    }
}
