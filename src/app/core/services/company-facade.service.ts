import {Injectable, inject, signal, computed} from '@angular/core';
import {Company, CreateCompany} from '../models/corporate/company';
import {CompanyService} from './company.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyFacadeService {
    private companyService = inject(CompanyService);

    private _companies = signal<Company[]>([]);
    private _loading = signal(false);
    private _loadingCreate = signal(false);
    private _loadingDelete = signal(false);
    private _error = signal<string | null>(null);
    private _errorCreate = signal<string | null>(null);

    readonly companies = this._companies.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly loadingCreate = this._loadingCreate.asReadonly();
    readonly loadingDelete = this._loadingDelete.asReadonly();
    readonly error = this._error.asReadonly();
    readonly errorCreate = this._errorCreate.asReadonly();

    readonly totalCompanies = computed(() => this._companies().length);

    loadCompanies(): void {
        this._loading.set(true);
        this._error.set(null);
        this.companyService.getAllCompanies().subscribe({
            next: (companies) => {
                this._companies.set(companies);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message);
                this._loading.set(false);
            }
        });
    }

    createCompany(company: CreateCompany): Promise<Company> {
        this._loadingCreate.set(true);
        this._errorCreate.set(null);
        return new Promise((resolve, reject) => {
            this.companyService.createCompany(company).subscribe({
                next: (created) => {
                    this._companies.update((list) => [...list, created]);
                    this._loadingCreate.set(false);
                    resolve(created);
                },
                error: (err) => {
                    this._errorCreate.set(err.message);
                    this._loadingCreate.set(false);
                    reject(err);
                }
            });
        });
    }

    deleteCompany(id: string): void {
        this._loadingDelete.set(true);
        this.companyService.deleteCompany(id).subscribe({
            next: () => {
                this._companies.update((list) => list.filter((c) => c.id !== id));
                this._loadingDelete.set(false);
            },
            error: (err) => {
                this._error.set(err.message);
                this._loadingDelete.set(false);
            }
        });
    }
}
