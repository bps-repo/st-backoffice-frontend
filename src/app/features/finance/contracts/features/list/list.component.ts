import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {GlobalTable, TableColumn} from 'src/app/shared/components/tables/global-table/global-table.component';
import {CONTRACTS_COLUMNS, CONTRACTS_GLOBAL_FILTERS} from "../contracts.cons";
import {ContractService} from 'src/app/core/services/contract.service';
import {Contract} from 'src/app/core/models/corporate/contract';

@Component({
    selector: 'app-general',
    imports: [
        CommonModule,
        GlobalTable,
        FormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        SplitButtonModule,
        TagModule,
        TooltipModule
    ],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    contracts: any[] = [];
    columns: TableColumn[] = CONTRACTS_COLUMNS;
    globalFilters = CONTRACTS_GLOBAL_FILTERS;
    loading = false;

    constructor(private readonly router: Router, private contractService: ContractService) {}

    ngOnInit(): void {
        this.fetchContracts();
    }

    fetchContracts(): void {
        this.loading = true;
        this.contractService.getContracts().subscribe({
            next: (resp) => {
                // Handle the new API response structure
                const data = resp?.data || [];
                this.contracts = data.map((contract: Contract) => this.normalizeRow(contract));
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching contracts:', error);
                this.loading = false;
            }
        });
    }

    private normalizeRow(contract: Contract) {
        const student = contract.student;
        const seller = contract.seller;
        const level = contract.levels?.[0];

        return {
            id: contract.id,
            studentCode: student?.code || '-',
            studentName: student?.user ? `${student.user.firstname} ${student.user.lastname}` : '-',
            studentEmail: student?.user?.email || '-',
            center: student?.center?.name || '-',
            level: level ? `${level.levelId} (${level.duration} meses)` : '-',
            seller: seller?.user ? `${seller.user.firstname} ${seller.user.lastname}` : '-',
            contractType: this.getContractTypeLabel(contract.contractType),
            period: this.formatPeriod(contract.startDate, contract.endDate),
            amount: this.formatCurrency(contract.amount),
            installments: this.formatInstallments(contract.installments),
            status: this.getStatusBadge(contract.status),
            actions: contract.id
        };
    }

    private getContractTypeLabel(type: string): string {
        const types: { [key: string]: string } = {
            'STANDARD': 'Padrão',
            'VIP': 'VIP',
            'PROMOTIONAL': 'Promocional',
            'CUSTOM': 'Personalizado'
        };
        return types[type] || type;
    }

    private formatPeriod(startDate: string, endDate: string): string {
        if (!startDate || !endDate) return '-';
        const start = new Date(startDate).toLocaleDateString('pt-BR');
        const end = new Date(endDate).toLocaleDateString('pt-BR');
        return `${start} - ${end}`;
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'AOA'
        }).format(amount);
    }

    private formatInstallments(installments: any[]): string {
        if (!installments || installments.length === 0) return '0';
        const total = installments.length;
        const paid = installments.filter(i => i.status === 'PAID').length;
        return `${paid}/${total}`;
    }

    private getStatusBadge(status: string): string {
        const statusMap: { [key: string]: { label: string; severity: string } } = {
            'ACTIVE': { label: 'Ativo', severity: 'success' },
            'HOLD': { label: 'Em Espera', severity: 'warning' },
            'CANCELLED': { label: 'Cancelado', severity: 'danger' },
            'COMPLETED': { label: 'Concluído', severity: 'info' }
        };
        return statusMap[status]?.label || status;
    }

    getStatusSeverity(status: string): string {
        const statusMap: { [key: string]: string } = {
            'Ativo': 'success',
            'Em Espera': 'warning',
            'Cancelado': 'danger',
            'Concluído': 'info'
        };
        return statusMap[status] || 'info';
    }

    navigateToCreateContract() {
        this.router.navigate(['/finances/contracts/create']).then();
    }

    viewContractDetails(contractId: string) {
        this.router.navigate(['/finances/contracts/details', contractId]).then();
    }
}
