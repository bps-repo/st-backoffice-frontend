import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {CreateCompany} from 'src/app/core/models/corporate/company';
import {CompanyFacadeService} from '../../../../../../core/services/company-facade.service';

@Component({
    selector: 'app-create-company-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
    templateUrl: './create-company-dialog.component.html'
})
export class CreateCompanyDialogComponent {
    private facade = inject(CompanyFacadeService);

    visible = false;

    company: CreateCompany = {
        name: '',
        contactEmail: '',
        contactPhone: '',
        registrationNumber: ''
    };

    readonly loadingCreate = this.facade.loadingCreate;
    readonly errorCreate = this.facade.errorCreate;

    show(): void {
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
    }

    save(): void {
        this.facade.createCompany(this.company).then(() => {
            this.hide();
            this.reset();
        });
    }

    reset(): void {
        this.company = {name: '', contactEmail: '', contactPhone: '', registrationNumber: ''};
    }
}
