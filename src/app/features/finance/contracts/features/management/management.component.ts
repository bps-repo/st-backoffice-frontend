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
    totalContracts: number = 4;
    activeContracts: number = 2;
    pendingValue: string = 'Kz 1600';
    renewalRate: string = '78%';

    // Lista de contratos
    contracts: any[] = [];
    
    constructor(private router: Router) {}

    ngOnInit() {
        // Simulando dados de contratos
        this.contracts = [
            {
                code: 'CT001',
                student: 'João Silva',
                course: 'Inglês Básico',
                period: '2024-01-15 até 2024-12-15',
                totalValue: 'Kz 1200',
                installments: '8/12',
                pendingValue: 'Kz 400 pendente',
                status: 'Ativo'
            },
            {
                code: 'CT003',
                student: 'Pedro Costa',
                course: 'Conversação',
                period: '2024-03-01 até 2024-11-30',
                totalValue: 'Kz 900',
                installments: '5/9',
                pendingValue: 'Kz 400 pendente',
                status: 'Vencido'
            },
            {
                code: 'CT002',
                student: 'Maria Santos',
                course: 'Inglês Avançado',
                period: '2024-02-01 até 2025-01-31',
                totalValue: 'Kz 1800',
                installments: '10/18',
                pendingValue: 'Kz 800 pendente',
                status: 'Ativo'
            },
            {
                code: 'CT004',
                student: 'Ana Lima',
                course: 'Preparatório TOEFL',
                period: '2024-01-10 até 2024-05-10',
                totalValue: 'Kz 2400',
                installments: '6/6',
                pendingValue: '',
                status: 'Finalizado'
            }
        ];
    }

    createNewContract() {
        this.router.navigate(['/finances/contracts/create']);
    }

    viewContract(contract: any) {
        this.router.navigate(['/finances/contracts/details', contract.code]);
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