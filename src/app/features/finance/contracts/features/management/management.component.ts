import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { Contract } from 'src/app/core/models/corporate/contract';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllContracts, selectContractsLoading } from 'src/app/core/store/corporate/contracts/contracts.selectors';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ContractActions } from 'src/app/core/store/corporate/contracts/contracts.actions';

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
    totalContracts = signal(0 as number);
    activeContracts = signal(0 as number);
    pendingValue = signal('Kz 0,00');
    renewalRate = signal('0%' as string);

    // Lista de contratos
    contracts$: Observable<any[]>;
    loading$: Observable<boolean> = of(false);

    constructor(
        private router: Router,
        private store: Store
    ) {
        this.contracts$ = this.store.select(selectAllContracts).pipe(
            map(contracts => contracts.map(contract => {
                this.calculateStatistics(contracts);
                return this.normalizeContract(contract)
            }
            ))
        );
        this.loading$ = this.store.select(selectContractsLoading);
    }

    ngOnInit() {
        this.loadContracts();
    }

    loadContracts(): void {
        this.store.dispatch(ContractActions.loadContracts());
    }
    private normalizeContract(contract: Contract) {
        const student = contract.student;
        const seller = contract.seller;

        return {
            id: contract.id,
            studentCode: student?.code || '-',
            studentName: student?.name || '-',
            studentEmail: student?.email || '-',
            center: student?.center?.name || '-',
            level: student?.level?.name || '-',
            seller: seller?.name || '-',
            contractType: this.getContractTypeLabel(contract.contractType),
            period: this.formatPeriod(contract.startDate, contract.endDate || ''),
            amount: this.formatCurrency(contract.financial?.finalAmount ?? contract.financial?.totalAmount ?? 0),
            installments: this.formatInstallments(contract.installments || []),
            status: this.getStatusLabel(contract.status),
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

    private calculateStatistics(contracts: Contract[]): void {
        this.totalContracts.set(contracts.length);
        this.activeContracts.set(contracts.filter(c => c.status === 'ACTIVE').length);

        // Calculate total pending value
        const totalPending = this.calculatePendingValue(contracts.flatMap(c => c.installments || []));

        this.pendingValue.set(totalPending);

        // Calculate completion rate
        const totalInstallments = contracts.reduce((sum, contract) => sum + (contract.installments?.length || 0), 0);
        const paidInstallments = contracts.reduce((sum, contract) =>
            sum + (contract.installments?.filter(i => i.status === 'PAID').length || 0), 0);

        const completionRate = totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;
        this.renewalRate.set(`${Math.round(completionRate)}%`);
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

    private formatInstallments(installments: any[] | undefined): string {
        if (!installments || installments.length === 0) return '0/0';
        const total = installments.length;
        const paid = installments.filter(i => i.status === 'PAID').length;
        return `${paid}/${total}`;
    }

    private calculatePendingValue(installments: any[] | undefined): string {
        if (!installments || installments.length === 0) return 'Kz 0,00';
        const pending = installments
            .filter(i => i.status === 'PENDING_PAYMENT')
            .reduce((sum, installment) => sum + installment.amount, 0);

        return pending > 0 ? `${this.formatCurrency(pending)}` : 'Kz 0,00';
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
