import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import * as CertificatesActions from 'src/app/core/store/schoolar/certificates/certificates.actions';
import { selectAllCertificates, selectCertificatesLoading } from 'src/app/core/store/schoolar/certificates/certificates.selectors';

interface Certificate {
    id: string;
    name: string;
    student: string;
    course: string;
    issueDate: string;
    status: string;
}

@Component({
    selector: 'app-list',
    imports: [CommonModule, GlobalTable],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit {
    certificates$: Observable<any[]>;
    certificates: any[] = [];
    loading$: Observable<boolean>;
    loading = false;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['id', 'name', 'student', 'course', 'issueDate', 'status'];

    constructor(private router: Router, private store: Store) {
        this.certificates$ = this.store.select(selectAllCertificates);
        this.loading$ = this.store.select(selectCertificatesLoading);
    }

    ngOnInit(): void {
        // Load certificates from store
        this.store.dispatch(CertificatesActions.loadCertificates());

        // Subscribe to certificates and loading observables
        this.certificates$.subscribe(certificates => {
            this.certificates = certificates;
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });

        // Define columns for the table
        this.columns = [
            {
                field: 'id',
                header: 'ID',
                filterType: 'text',
            },
            {
                field: 'name',
                header: 'Nome',
                filterType: 'text',
            },
            {
                field: 'student',
                header: 'Aluno',
                filterType: 'text',
            },
            {
                field: 'course',
                header: 'Curso',
                filterType: 'text',
            },
            {
                field: 'issueDate',
                header: 'Data de Emissão',
                filterType: 'text',
            },
            {
                field: 'status',
                header: 'Estado',
                filterType: 'text',
                customTemplate: true,
            },
            {
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    viewDetails(certificate: any): void {
        // Dispatch loadCertificate action to load the selected certificate
        this.store.dispatch(CertificatesActions.loadCertificate({ id: certificate.id }));
        this.router.navigate(['/schoolar/certificates', certificate.id]);
    }

    createCertificate(): void {
        // Navigate to create page
        this.router.navigate(['/schoolar/certificates/create']);
    }
}
