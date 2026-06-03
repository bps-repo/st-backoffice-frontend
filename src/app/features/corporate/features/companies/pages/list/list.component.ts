import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {GlobalTable, TableColumn} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Company} from 'src/app/core/models/corporate/company';
import {CompanyFacadeService} from '../../../../../../core/services/company-facade.service';
import {CreateCompanyDialogComponent} from '../../dialogs/create-company-dialog/create-company-dialog.component';
import {EditCompanyDialogComponent} from '../../dialogs/edit-company-dialog/edit-company-dialog.component';
import {COMPANY_COLUMNS} from '../../company.const';

@Component({
    selector: 'app-companies-list',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        GlobalTable,
        CreateCompanyDialogComponent,
        EditCompanyDialogComponent,
        ButtonModule,
        ConfirmDialogModule,
        RippleModule,
    ],
    templateUrl: './list.component.html',
    providers: [ConfirmationService]
})
export class ListComponent implements OnInit {
    private confirmationService = inject(ConfirmationService);

    readonly facade = inject(CompanyFacadeService);

    @ViewChild(CreateCompanyDialogComponent) createDialog!: CreateCompanyDialogComponent;
    @ViewChild(EditCompanyDialogComponent) editDialog!: EditCompanyDialogComponent;

    columns: TableColumn[] = COMPANY_COLUMNS;
    columnTemplates?: {[key: string]: TemplateRef<any>};

    ngOnInit(): void {
        this.facade.loadCompanies();
    }

    openCreate(): void {
        this.createDialog.show();
    }

    editCompany(company: Company): void {
        this.editDialog.show(company);
    }

    deleteCompany(company: Company): void {
        this.confirmationService.confirm({
            message: `Tem certeza de que deseja excluir a empresa "${company.name}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle text-warning',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => this.facade.deleteCompany(company.id),
        });
    }
}
