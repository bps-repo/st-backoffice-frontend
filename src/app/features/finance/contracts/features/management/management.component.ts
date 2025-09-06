import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {TagModule} from 'primeng/tag';
import {Contract} from 'src/app/core/models/corporate/contract';
import {ContractService} from 'src/app/core/services/contract.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-contracts-management',
    templateUrl: './management.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        CardModule,
        TableModule,
        TooltipModule,
        TagModule
    ]
})
export class ManagementComponent implements OnInit {
    // Estatísticas de contratos
    totalContracts: number = 0;
    activeContracts: number = 0;
    pendingValue: string = 'Kz 0';
    renewalRate: string = '0%';

    // Lista de contratos
    contracts: any[] = [];
    loading = false;

    constructor(
        private router: Router,
        private contractService: ContractService
    ) {}

    ngOnInit() {
        this.fetchContracts();
    }

    fetchContracts(): void {
        this.loading = true;
        this.contractService.getContracts().subscribe({
            next: (resp) => {
                const data = resp?.data || [];
                this.contracts = data.map((contract: Contract) => this.normalizeContract(contract));
                this.calculateStatistics(data);
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching contracts:', error);
                this.loading = false;
            }
        });
    }

    private normalizeContract(contract: Contract): any {
        const student = contract.student;
        const level = contract.levels?.[0];

        return {
            id: contract.id,
            code: student?.code || '-',
            student: student?.user ? `${student.user.firstname} ${student.user.lastname}` : '-',
            course: level ? `Nível ${level.levelId}` : '-',
            period: this.formatPeriod(contract.startDate, contract.endDate),
            totalValue: this.formatCurrency(contract.amount),
            installments: this.formatInstallments(contract.installments),
            pendingValue: this.calculatePendingValue(contract.installments),
            status: this.getStatusLabel(contract.status)
        };
    }

    private calculateStatistics(contracts: Contract[]): void {
        this.totalContracts = contracts.length;
        this.activeContracts = contracts.filter(c => c.status === 'ACTIVE').length;

        // Calculate total pending value
        const totalPending = contracts.reduce((sum, contract) => {
            const pending = contract.installments
                .filter(i => i.status === 'PENDING_PAYMENT')
                .reduce((installmentSum, installment) => installmentSum + installment.amount, 0);
            return sum + pending;
        }, 0);

        this.pendingValue = this.formatCurrency(totalPending);

        // Calculate completion rate
        const totalInstallments = contracts.reduce((sum, contract) => sum + contract.installments.length, 0);
        const paidInstallments = contracts.reduce((sum, contract) =>
            sum + contract.installments.filter(i => i.status === 'PAID').length, 0);

        const completionRate = totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;
        this.renewalRate = `${Math.round(completionRate)}%`;
    }

    private formatPeriod(startDate: string, endDate: string): string {
        if (!startDate || !endDate) return '-';
        const start = new Date(startDate).toLocaleDateString('pt-BR');
        const end = new Date(endDate).toLocaleDateString('pt-BR');
        return `${start} até ${end}`;
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'AOA'
        }).format(amount);
    }

    private formatInstallments(installments: any[]): string {
        if (!installments || installments.length === 0) return '0/0';
        const total = installments.length;
        const paid = installments.filter(i => i.status === 'PAID').length;
        return `${paid}/${total}`;
    }

    private calculatePendingValue(installments: any[]): string {
        if (!installments || installments.length === 0) return '';
        const pending = installments
            .filter(i => i.status === 'PENDING_PAYMENT')
            .reduce((sum, installment) => sum + installment.amount, 0);

        return pending > 0 ? `${this.formatCurrency(pending)} pendente` : '';
    }

    private getStatusLabel(status: string): string {
        const statusMap: { [key: string]: string } = {
            'ACTIVE': 'Ativo',
            'HOLD': 'Em Espera',
            'CANCELLED': 'Cancelado',
            'COMPLETED': 'Finalizado'
        };
        return statusMap[status] || status;
    }

    createNewContract() {
        this.router.navigate(['/finances/contracts/create']);
    }

    viewContract(contract: any) {
        this.router.navigate(['/finances/contracts/details', contract.id]);
    }

    editContract(contract: any) {
        // Implementar edição de contrato
        console.log('Edit contract:', contract);
    }

    renewContract(contract: any) {
        // Implementar renovação de contrato
        console.log('Renew contract:', contract);
    }

    cancelContract(contract: any) {
        // Implementar cancelamento de contrato
        console.log('Cancel contract:', contract);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Ativo':
                return 'success';
            case 'Vencido':
                return 'danger';
            case 'Finalizado':
                return 'info';
            default:
                return 'warning';
        }
    }
}
