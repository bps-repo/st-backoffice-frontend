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
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {Store} from "@ngrx/store";
import {ContractActions} from "../../../../../core/store/corporate/contracts/contracts.actions";
import {Observable, of, forkJoin} from "rxjs";
import {
    selectContractsError,
    selectContractsLoading, selectDownloading, selectSelectedContractByID
} from "../../../../../core/store/corporate/contracts/contracts.selectors";
import {InstallmentsActions} from "../../../../../core/store/finance/installments/installments.actions";
// Use Contract's Installment type for contract.installments
import { Installment as ContractInstallment } from 'src/app/core/models/corporate/contract';
import { InstallmentService } from 'src/app/core/services/installment.service';

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

    // Edit installment dialog state
    showInstallmentEditDialog: boolean = false;
    installmentToEdit: ContractInstallment | null = null;
    editAmount: number | null = null;
    editDueDate: Date | null = null;
    // Auto-adjustment planning
    adjustmentPreview: Array<{ id: string | undefined; installmentNumber: number; oldAmount: number; newAmount: number }> = [];
    adjustmentError: string | null = null;

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
        private store$: Store,
        private installmentService: InstallmentService
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

    // ===== Installment edit & auto-adjust logic =====
    canEditInstallment(inst: ContractInstallment): boolean {
        return inst.status === 'PENDING_PAYMENT' || inst.status === 'OVERDUE';
    }

    editInstallment(inst: ContractInstallment): void {
        if (!this.contract) return;
        if (!this.canEditInstallment(inst)) return;
        this.installmentToEdit = inst;
        this.editAmount = inst.amount;
        this.editDueDate = inst.dueDate ? new Date(inst.dueDate) : new Date();
        // compute preview with current value (no change) to reset errors
        this.computeAdjustmentPlan();
        this.showInstallmentEditDialog = true;
    }

    onEditAmountChange(): void {
        this.computeAdjustmentPlan();
    }

    private computeAdjustmentPlan(): void {
        this.adjustmentError = null;
        this.adjustmentPreview = [];
        if (!this.contract || !this.installmentToEdit || this.editAmount == null) return;

        const edited = this.installmentToEdit;
        const delta = +(this.editAmount - edited.amount).toFixed(2);
        if (delta === 0) {
            // No change, nothing to adjust
            return;
        }

        // Build eligible targets from the end to the start, excluding the edited installment.
        const installments = (this.contract.installments || [])
            .slice()
            .sort((a, b) => a.installmentNumber - b.installmentNumber);

        const eligibles = installments
            .filter(i => i.id !== edited.id)
            // Prefer to not adjust PAID installments
            .filter(i => i.status !== 'PAID')
            .reverse(); // now from last to first

        if (eligibles.length === 0) {
            this.adjustmentError = 'Não existem parcelas elegíveis para ajustar automaticamente.';
            return;
        }

        if (delta > 0) {
            // Positive delta: add entire delta to the last installment only
            const last = eligibles[0];
            const newAmt = +(last.amount + delta).toFixed(2);
            this.adjustmentPreview.push({ id: last.id, installmentNumber: last.installmentNumber, oldAmount: last.amount, newAmount: newAmt });
            return;
        }

        // Negative delta: need to subtract |delta| from the last, and if not enough, move to previous recursively
        let remaining = -delta; // positive value to subtract in total
        const MIN_AMOUNT = 0.01;

        for (const target of eligibles) {
            if (remaining <= 0) break;
            const capacity = +(Math.max(target.amount - MIN_AMOUNT, 0)).toFixed(2);
            if (capacity <= 0) continue;

            const take = Math.min(capacity, remaining);
            const newAmt = +(target.amount - take).toFixed(2);
            this.adjustmentPreview.push({ id: target.id, installmentNumber: target.installmentNumber, oldAmount: target.amount, newAmount: newAmt });
            remaining = +(remaining - take).toFixed(2);
        }

        if (remaining > 0) {
            this.adjustmentPreview = [];
            this.adjustmentError = 'Não é possível distribuir a diminuição entre as últimas parcelas sem violar o valor mínimo (0,01). Reduza a alteração.';
        }
    }

    saveInstallmentEdit(): void {
        if (!this.contract || !this.installmentToEdit || this.editAmount == null || !this.editDueDate) return;
        if (this.adjustmentError) return;

        const requests: Observable<any>[] = [];
        // Update edited installment
        requests.push(
            this.installmentService.updateInstallment(this.installmentToEdit.id!, {
                installmentNumber: this.installmentToEdit.installmentNumber,
                amount: +(+this.editAmount).toFixed(2),
                dueDate: this.toIsoDate(this.editDueDate)
            })
        );

        // Add adjustment updates
        for (const adj of this.adjustmentPreview) {
            // Skip if no change
            if (adj.oldAmount === adj.newAmount) continue;
            requests.push(
                this.installmentService.updateInstallment(adj.id!, {
                    installmentNumber: adj.installmentNumber,
                    amount: +adj.newAmount.toFixed(2)
                })
            );
        }

        forkJoin(requests).subscribe({
            next: () => {
                this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Parcela atualizada e ajustes aplicados.'});
                this.showInstallmentEditDialog = false;
                this.installmentToEdit = null;
                this.loadContractDetails();
            },
            error: (err) => {
                console.error(err);
                this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar parcela.'});
            }
        });
    }

    cancelInstallmentEdit(): void {
        this.showInstallmentEditDialog = false;
        this.installmentToEdit = null;
        this.adjustmentPreview = [];
        this.adjustmentError = null;
    }

    private toIsoDate(date: Date): string {
        const d = new Date(date);
        const tzOffset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
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

        this.store$.dispatch(InstallmentsActions.payInstallment({
            installmentId: this.selectedPayment.id,
            payload: {paymentMethod: "CREDIT_CARD", amount: this.paymentAmount}
        }))

        setTimeout(() => {
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

        location.reload();
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
