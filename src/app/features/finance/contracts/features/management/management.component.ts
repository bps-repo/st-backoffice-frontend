import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ContractService } from 'src/app/core/services/contract.service';
import {
    Contract,
    ContractListFilter,
    ContractStatus,
    ContractType,
    CourseType,
} from 'src/app/core/models/corporate/contract';

@Component({
    selector: 'app-contracts-management',
    templateUrl: './management.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        ChipModule,
        ConfirmDialogModule,
        DropdownModule,
        InputTextModule,
        PaginatorModule,
        TableModule,
        TagModule,
        TooltipModule,
    ],
    providers: [ConfirmationService],
})
export class ManagementComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly contractService = inject(ContractService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly confirmationService = inject(ConfirmationService);

    // ── table data ──────────────────────────────────────────────────────────
    rows: Contract[] = [];
    readonly loading$ = new BehaviorSubject(false);

    // ── pagination ───────────────────────────────────────────────────────────
    page = 0;
    size = 10;
    totalRecords = 0;

    // ── statistics ───────────────────────────────────────────────────────────
    totalContracts = signal(0);
    activeContracts = signal(0);
    pendingValue = signal('Kz 0,00');
    paymentRate = signal('0%');

    // ── filter state ─────────────────────────────────────────────────────────
    filterStatus: ContractStatus | null = null;
    filterContractType: ContractType | null = null;
    filterCourseType: CourseType | null = null;
    filterStudentName = '';
    filterSort = 'startDate,desc';

    private readonly studentNameInput$ = new Subject<string>();

    // ── dropdown options ─────────────────────────────────────────────────────
    readonly statusOptions: SelectItem[] = [
        { label: 'Todos os estados', value: null },
        { label: 'Ativo', value: ContractStatus.ACTIVE },
        { label: 'Em espera', value: ContractStatus.HOLD },
        { label: 'Cancelado', value: ContractStatus.CANCELLED },
        { label: 'Finalizado', value: ContractStatus.COMPLETED },
        { label: 'Pagamento Pendente', value: ContractStatus.PENDING_PAYMENT },
        { label: 'Em atraso', value: ContractStatus.OVERDUE },
    ];

    readonly contractTypeOptions: SelectItem[] = [
        { label: 'Todos os tipos', value: null },
        { label: 'Padrão', value: ContractType.STANDARD },
        { label: 'VIP', value: ContractType.VIP },
    ];

    readonly courseTypeOptions: SelectItem[] = [
        { label: 'Todos os cursos', value: null },
        { label: 'Idiomas', value: CourseType.LANGUAGE },
        { label: 'Catálogo', value: CourseType.CATALOG },
    ];

    readonly sortOptions: SelectItem[] = [
        { label: 'Data início (mais recente)', value: 'startDate,desc' },
        { label: 'Data início (mais antigo)', value: 'startDate,asc' },
        { label: 'Código (A→Z)', value: 'code,asc' },
        { label: 'Código (Z→A)', value: 'code,desc' },
        { label: 'Valor (maior)', value: 'financial.finalAmount,desc' },
        { label: 'Valor (menor)', value: 'financial.finalAmount,asc' },
    ];

    // ── active filter chips ───────────────────────────────────────────────────
    get activeFilters(): { key: string; label: string }[] {
        const chips: { key: string; label: string }[] = [];
        if (this.filterStatus) {
            chips.push({ key: 'status', label: this.statusOptions.find(o => o.value === this.filterStatus)?.label ?? this.filterStatus });
        }
        if (this.filterContractType) {
            chips.push({ key: 'contractType', label: this.contractTypeOptions.find(o => o.value === this.filterContractType)?.label ?? this.filterContractType });
        }
        if (this.filterCourseType) {
            chips.push({ key: 'courseType', label: this.courseTypeOptions.find(o => o.value === this.filterCourseType)?.label ?? this.filterCourseType });
        }
        if (this.filterStudentName.trim()) {
            chips.push({ key: 'studentName', label: `Aluno: ${this.filterStudentName.trim()}` });
        }
        return chips;
    }

    ngOnInit(): void {
        // Debounce the student name input to avoid a request on every keystroke
        this.studentNameInput$
            .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.page = 0;
                this.load();
            });

        this.load();
    }

    // ── data loading ──────────────────────────────────────────────────────────
    load(): void {
        const filter: ContractListFilter = {
            status: this.filterStatus ?? undefined,
            contractType: this.filterContractType ?? undefined,
            courseType: this.filterCourseType ?? undefined,
            studentName: this.filterStudentName.trim() || undefined,
            page: this.page,
            size: this.size,
            sort: this.filterSort,
        };

        this.loading$.next(true);

        this.contractService
            .getContracts(filter)
            .pipe(finalize(() => this.loading$.next(false)), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: page => {
                    this.rows = page.content ?? [];
                    this.totalRecords = page.totalElements ?? 0;
                    this.updateStatistics(page.content ?? []);
                },
                error: () => {
                    this.rows = [];
                    this.totalRecords = 0;
                },
            });
    }

    // ── filter handlers ───────────────────────────────────────────────────────
    onDropdownFilterChange(): void {
        this.page = 0;
        this.load();
    }

    onStudentNameInput(): void {
        this.studentNameInput$.next(this.filterStudentName);
    }

    removeFilter(key: string): void {
        if (key === 'status')       this.filterStatus = null;
        if (key === 'contractType') this.filterContractType = null;
        if (key === 'courseType')   this.filterCourseType = null;
        if (key === 'studentName')  this.filterStudentName = '';
        this.page = 0;
        this.load();
    }

    clearAllFilters(): void {
        this.filterStatus = null;
        this.filterContractType = null;
        this.filterCourseType = null;
        this.filterStudentName = '';
        this.filterSort = 'startDate,desc';
        this.page = 0;
        this.load();
    }

    // ── pagination ────────────────────────────────────────────────────────────
    onPageChange(event: PaginatorState): void {
        this.page = event.page ?? 0;
        this.size = event.rows ?? 10;
        this.load();
    }

    // ── navigation ────────────────────────────────────────────────────────────
    createNewContract(newContract = false): void {
        this.router.navigate([newContract ? '/finances/contracts/create' : '/finances/contracts/renew']).then();
    }

    viewContract(contract: Contract): void {
        this.router.navigate(['/finances/contracts/details', contract.id]).then();
    }

    editContract(_contract: Contract): void { /* TODO */ }
    renewContract(_contract: Contract): void { /* TODO */ }
    cancelContract(_contract: Contract): void { /* TODO */ }

    // ── display helpers ───────────────────────────────────────────────────────
    getStatusSeverity(status: string): string {
        const map: Record<string, string> = {
            ACTIVE: 'success',
            HOLD: 'warning',
            CANCELLED: 'danger',
            COMPLETED: 'info',
            PENDING_PAYMENT: 'warning',
            OVERDUE: 'danger',
            EXTENDED_PAYMENT: 'warning',
        };
        return map[status] ?? 'secondary';
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = {
            ACTIVE: 'Ativo',
            HOLD: 'Em Espera',
            CANCELLED: 'Cancelado',
            COMPLETED: 'Finalizado',
            PENDING_PAYMENT: 'Pag. Pendente',
            OVERDUE: 'Em atraso',
            EXTENDED_PAYMENT: 'Pag. Estendido',
        };
        return map[status] ?? status;
    }

    getCourseTypeLabel(type?: CourseType): string {
        if (!type) return '—';
        return type === CourseType.LANGUAGE ? 'Idiomas' : 'Catálogo';
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);
    }

    formatPeriod(startDate: string, endDate?: string): string {
        if (!startDate) return '—';
        const fmt = (d: string) => new Date(d).toLocaleDateString('pt-BR');
        return endDate ? `${fmt(startDate)} – ${fmt(endDate)}` : fmt(startDate);
    }

    formatInstallments(installments: Contract['installments']): string {
        if (!installments?.length) return '0/0';
        const paid = installments.filter(i => i.status === 'PAID').length;
        return `${paid}/${installments.length}`;
    }

    // ── statistics (over current page) ───────────────────────────────────────
    private updateStatistics(contracts: Contract[]): void {
        this.totalContracts.set(this.totalRecords);
        this.activeContracts.set(contracts.filter(c => c.status === ContractStatus.ACTIVE).length);

        const pending = contracts
            .flatMap(c => c.installments ?? [])
            .filter(i => i.status === 'PENDING_PAYMENT')
            .reduce((sum, i) => sum + i.amount, 0);
        this.pendingValue.set(pending > 0 ? this.formatCurrency(pending) : 'Kz 0,00');

        const total = contracts.reduce((s, c) => s + (c.installments?.length ?? 0), 0);
        const paid  = contracts.reduce((s, c) => s + (c.installments?.filter(i => i.status === 'PAID').length ?? 0), 0);
        this.paymentRate.set(total > 0 ? `${Math.round((paid / total) * 100)}%` : '0%');
    }
}
