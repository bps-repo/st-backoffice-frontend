import {Injectable, inject, signal, computed} from '@angular/core';
import {Company, CreateCompany} from '../models/corporate/company';
import {CompanyService} from './company.service';
import {extractApiErrorMessage} from '../utils/parse-api-error';

@Injectable({
    providedIn: 'root'
})
export class CompanyFacadeService {
    private companyService = inject(CompanyService);

    private _companies = signal<Company[]>([]);
    private _loading = signal(false);
    private _loadingCreate = signal(false);
    private _loadingDelete = signal(false);
    private _loadingUpdate = signal(false);
    private _error = signal<string | null>(null);
    private _errorCreate = signal<string | null>(null);
    private _errorUpdate = signal<string | null>(null);

    readonly companies = this._companies.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly loadingCreate = this._loadingCreate.asReadonly();
    readonly loadingDelete = this._loadingDelete.asReadonly();
    readonly loadingUpdate = this._loadingUpdate.asReadonly();
    readonly error = this._error.asReadonly();
    readonly errorCreate = this._errorCreate.asReadonly();
    readonly errorUpdate = this._errorUpdate.asReadonly();

    readonly totalCompanies = computed(() => this._companies().length);

    clearCreateError(): void {
        this._errorCreate.set(null);
    }

    clearUpdateError(): void {
        this._errorUpdate.set(null);
    }

    loadCompanies(): void {
        this._loading.set(true);
        this._error.set(null);
        this.companyService.getAllCompanies().subscribe({
            next: (companies) => {
                this._companies.set(companies);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(extractApiErrorMessage(err));
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
                    this._errorCreate.set(extractApiErrorMessage(err));
                    this._loadingCreate.set(false);
                    reject(err);
                }
            });
        });
    }

    updateCompany(id: string, changes: Partial<Company>): Promise<Company> {
        this._loadingUpdate.set(true);
        this._errorUpdate.set(null);
        return new Promise((resolve, reject) => {
            this.companyService.updateCompany(id, changes).subscribe({
                next: (updated) => {
                    this._companies.update((list) =>
                        list.map((c) => (c.id === id ? updated : c))
                    );
                    this._loadingUpdate.set(false);
                    resolve(updated);
                },
                error: (err) => {
                    this._errorUpdate.set(extractApiErrorMessage(err));
                    this._loadingUpdate.set(false);
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
                this._error.set(extractApiErrorMessage(err));
                this._loadingDelete.set(false);
            }
        });
    }
}
