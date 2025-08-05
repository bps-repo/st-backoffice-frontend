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
    contract: any = null;
    loading: boolean = true;
    payments: any[] = [];
    
    // Diálogos
    showPaymentDetailsDialog: boolean = false;
    showPaymentChargeDialog: boolean = false;
    
    // Parcela selecionada
    selectedPayment: any = null;
    
    // Dados para cobrança
    paymentMethods: any[] = [
        { name: 'Multicaixa', code: 'MULTICAIXA' },
        { name: 'Transferência Bancária', code: 'BANK_TRANSFER' },
        { name: 'Dinheiro', code: 'CASH' },
        { name: 'Cartão de Crédito', code: 'CREDIT_CARD' }
    ];
    selectedPaymentMethod: any = null;
    paymentDate: Date = new Date();
    paymentReference: string = '';
    paymentAmount: number | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.contractId = this.route.snapshot.paramMap.get('id') || '';
        this.loadContractDetails();
    }

    loadContractDetails(): void {
        // Simulando carregamento de dados do contrato
        setTimeout(() => {
            this.contract = {
                id: this.contractId,
                code: 'CT001',
                student: 'João Silva',
                course: 'Inglês Básico',
                startDate: '2024-01-15',
                endDate: '2024-12-15',
                period: '2024-01-15 até 2024-12-15',
                contractType: 'FULL_COURSE',
                contractTypeLabel: 'Curso Completo',
                paymentFrequency: 'MONTHLY',
                paymentFrequencyLabel: 'Mensal',
                totalValue: 'Kz 1200',
                paymentAmount: 100,
                installments: '8/12',
                pendingValue: 'Kz 400',
                status: 'Ativo',
                terms: 'Este contrato estabelece os termos e condições para o curso de Inglês Básico...',
                createdAt: '2024-01-10',
                updatedAt: '2024-01-10'
            };

            // Simulando pagamentos do contrato
            this.payments = [
                { id: '1', date: '2024-01-15', amount: 'Kz 100', status: 'Pago' },
                { id: '2', date: '2024-02-15', amount: 'Kz 100', status: 'Pago' },
                { id: '3', date: '2024-03-15', amount: 'Kz 100', status: 'Pago' },
                { id: '4', date: '2024-04-15', amount: 'Kz 100', status: 'Pago' },
                { id: '5', date: '2024-05-15', amount: 'Kz 100', status: 'Pago' },
                { id: '6', date: '2024-06-15', amount: 'Kz 100', status: 'Pago' },
                { id: '7', date: '2024-07-15', amount: 'Kz 100', status: 'Pago' },
                { id: '8', date: '2024-08-15', amount: 'Kz 100', status: 'Pago' },
                { id: '9', date: '2024-09-15', amount: 'Kz 100', status: 'Pendente' },
                { id: '10', date: '2024-10-15', amount: 'Kz 100', status: 'Pendente' },
                { id: '11', date: '2024-11-15', amount: 'Kz 100', status: 'Pendente' },
                { id: '12', date: '2024-12-15', amount: 'Kz 100', status: 'Pendente' }
            ];

            this.loading = false;
        }, 1000);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Ativo':
                return 'success';
            case 'Vencido':
                return 'danger';
            case 'Finalizado':
                return 'info';
            case 'Pago':
                return 'success';
            case 'Pendente':
                return 'warning';
            default:
                return 'warning';
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
                this.contract.status = 'Cancelado';
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/finances/contracts']);
    }
    
    // Métodos para detalhes da parcela
    viewPaymentDetails(payment: any): void {
        this.selectedPayment = payment;
        this.showPaymentDetailsDialog = true;
    }
    
    // Métodos para cobrança de parcela
    chargePayment(payment: any): void {
        this.selectedPayment = payment;
        this.paymentAmount = Number(payment.amount.replace('Kz ', ''));
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
        
        // Simulando processamento de pagamento
        setTimeout(() => {
            // Atualizando o status da parcela para 'Pago'
            const index = this.payments.findIndex(p => p.id === this.selectedPayment.id);
            if (index !== -1) {
                this.payments[index].status = 'Pago';
                this.payments[index].paymentMethod = this.selectedPaymentMethod.name;
                this.payments[index].paymentDate = this.paymentDate.toLocaleDateString('pt-BR');
                this.payments[index].paymentReference = this.paymentReference;
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
}