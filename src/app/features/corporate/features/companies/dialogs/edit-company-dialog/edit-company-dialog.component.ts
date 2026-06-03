import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {Company, CreateCompany} from 'src/app/core/models/corporate/company';
import {CompanyFacadeService} from '../../../../../../core/services/company-facade.service';

@Component({
    selector: 'app-edit-company-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
    templateUrl: './edit-company-dialog.component.html'
})
export class EditCompanyDialogComponent {
    private facade = inject(CompanyFacadeService);

    visible = false;
    private companyId!: string;

    form: CreateCompany = {
        name: '',
        contactEmail: '',
        contactPhone: '',
        registrationNumber: ''
    };

    readonly loadingUpdate = this.facade.loadingUpdate;
    readonly errorUpdate = this.facade.errorUpdate;

    show(company: Company): void {
        this.facade.clearUpdateError();
        this.companyId = company.id;
        this.form = {
            name: company.name,
            contactEmail: company.contactEmail,
            contactPhone: company.contactPhone,
            registrationNumber: company.registrationNumber
        };
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
    }

    save(): void {
        this.facade.updateCompany(this.companyId, this.form).then(() => {
            this.hide();
        });
    }

    reset(): void {
        this.form = {name: '', contactEmail: '', contactPhone: '', registrationNumber: ''};
    }
}
