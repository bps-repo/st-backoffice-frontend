import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Contract} from 'src/app/core/models/corporate/contract';
import {ContractService} from 'src/app/core/services/contract.service';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {Store} from "@ngrx/store";
import {ContractActions} from "../../../../../core/store/corporate/contracts/contracts.actions";
import {Observable, of} from "rxjs";
import {
    selectContractsError,
    selectContractsLoading, selectDownloading, selectSelectedContractByID
} from "../../../../../core/store/corporate/contracts/contracts.selectors";

@Component({
    selector: 'app-contract-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        TabViewModule,
        TableModule,
        TagModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule,
        DialogModule,
        InputTextModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class DetailComponent implements OnInit {
    contractId: string = '';
    contract: Contract | null = null;
    loading$: Observable<boolean> = of(false);
    downloading$: Observable<boolean> = of(false);
    errors$: Observable<any> = of(null);

    showPaymentDetailsDialog: boolean = false;
    showPaymentChargeDialog: boolean = false;

    selectedPayment: any = null;

    paymentMethods: any[] = [
        {name: 'Multicaixa', code: 'MULTICAIXA'},
        {name: 'Transferência Bancária', code: 'BANK_TRANSFER'},
        {name: 'Dinheiro', code: 'CASH'},
        {name: 'Cartão de Crédito', code: 'CREDIT_CARD'}
    ];
    selectedPaymentMethod: any = null;
    paymentDate: Date = new Date();
    paymentReference: string = '';
    paymentAmount: number | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private store$: Store
    ) {
        this.store$.select(selectSelectedContractByID).subscribe(contract => {
            this.contract = contract
        })
        this.loading$ = this.store$.select(selectContractsLoading)
        this.downloading$ = this.store$.select(selectDownloading)
        this.errors$ = this.store$.select(selectContractsError)
    }

    ngOnInit(): void {
        this.contractId = this.route.snapshot.paramMap.get('id') || '';
        this.loadContractDetails();
    }

    loadContractDetails(): void {
        this.store$.dispatch(ContractActions.loadContract({id: this.contractId}))
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'HOLD':
                return 'warning';
            case 'CANCELLED':
                return 'danger';
            case 'COMPLETED':
                return 'info';
            case 'PAID':
                return 'success';
            case 'PENDING_PAYMENT':
                return 'warning';
            case 'OVERDUE':
                return 'danger';
            default:
                return 'warning';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'Ativo';
            case 'HOLD':
                return 'Em Espera';
            case 'CANCELLED':
                return 'Cancelado';
            case 'COMPLETED':
                return 'Finalizado';
            case 'PAID':
                return 'Pago';
            case 'PENDING_PAYMENT':
                return 'Pagamento Pendente';
            case 'OVERDUE':
                return 'Vencido';
            default:
                return status;
        }
    }

    editContract(): void {
        this.router.navigate(['/finances/contracts/edit', this.contractId]);
    }

    renewContract(): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja renovar este contrato?',
            header: 'Confirmação de Renovação',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Contrato renovado com sucesso!'
                });
            }
        });
    }

    cancelContract(): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja cancelar este contrato?',
            header: 'Confirmação de Cancelamento',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Contrato cancelado com sucesso!'
                });
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/finances/contracts']).then();
    }

    viewPaymentDetails(installment: any): void {
        this.selectedPayment = installment;
        this.showPaymentDetailsDialog = true;
    }

    chargePayment(installment: any): void {
        this.selectedPayment = installment;
        this.paymentAmount = installment.amount;
        this.showPaymentChargeDialog = true;
    }

    processPayment(): void {
        if (!this.selectedPaymentMethod || !this.paymentDate || !this.paymentAmount) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor, preencha todos os campos obrigatórios.'
            });
            return;
        }

        setTimeout(() => {
            // Atualizando o status da parcela para 'PAID'
            if (this.contract && this.contract.installments && this.selectedPayment) {
                const installment = this.contract.installments.find(i => i.id === this.selectedPayment.id);
                if (installment) {
                    installment.status = 'PAID';
                }
            }

            // Fechando o diálogo e mostrando mensagem de sucesso
            this.showPaymentChargeDialog = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Pagamento processado com sucesso!'
            });

            // Resetando os campos
            this.resetPaymentForm();
        }, 1000);
    }

    resetPaymentForm(): void {
        this.selectedPaymentMethod = null;
        this.paymentDate = new Date();
        this.paymentReference = '';
        this.paymentAmount = null;
    }

    // Helper methods for contract statistics
    getTotalPaidAmount(): number {
        if (!this.contract || !this.contract.installments) return 0;
        return this.contract.installments
            .filter(installment => installment.status === 'PAID')
            .reduce((total, installment) => total + installment.amount, 0);
    }

    getPendingAmount(): number {
        if (!this.contract || !this.contract.installments) return 0;
        return this.contract.installments
            .filter(installment => installment.status === 'PENDING_PAYMENT' || installment.status === 'OVERDUE')
            .reduce((total, installment) => total + installment.amount, 0);
    }

    getPaymentProgress(): number {
        if (!this.contract || !this.contract.installments || this.contract.installments.length === 0) return 0;
        const totalPaid = this.getTotalPaidAmount();
        const totalAmount = this.contract.financial?.finalAmount ?? this.contract.financial?.totalAmount ?? 0;
        if (!totalAmount || totalAmount === 0) return 0;
        return Math.round((totalPaid / totalAmount) * 100);
    }

    getPaidInstallmentsCount(): number {
        if (!this.contract || !this.contract.installments) return 0;
        return this.contract.installments.filter(installment => installment.status === 'PAID').length;
    }

    getTotalInstallmentsCount(): number {
        if (!this.contract || !this.contract.installments) return 0;
        return this.contract.installments.length;
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA'
        }).format(amount);
    }

    formatDate(dateString: string): string {
        if (!dateString || dateString == "N/A") return '';
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    downloadContract() {
        this.store$.dispatch(ContractActions.downloadContract({contractId: this.contractId}))
    }
}
