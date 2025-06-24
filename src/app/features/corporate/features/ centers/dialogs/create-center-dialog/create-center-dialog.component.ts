import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {Store} from '@ngrx/store';
import {Center} from 'src/app/core/models/corporate/center';
import {Observable} from 'rxjs';
import {CenterState} from "../../../../../../core/store/corporate/center/centerState";
import * as CenterSeletors from "../../../../../../core/store/corporate/center/centers.selector";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";

@Component({
    selector: 'app-create-center-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
    ],
    templateUrl: './create-center-dialog.component.html'
})
export class CreateCenterDialogComponent implements OnInit {

    visible: boolean = false;

    center: Partial<Center> = {
        name: '',
        address: '',
        city: '',
        phone: '',
        active: true
    };

    // Dropdown options
    activeOptions: SelectItem[] = [

        {label: 'Yes', value: true},
        {label: 'No', value: false}
    ];

    loading$: Observable<boolean>;
    error$: Observable<any>;

    constructor(private store: Store<CenterState>) {
        this.loading$ = this.store.select(CenterSeletors.selectLoadingCreateCenter);
        this.error$ = this.store.select(CenterSeletors.selectCenterAnyError);
    }

    ngOnInit() {
        // Monitorar erros ou sucesso
        this.error$.subscribe((error) => {
            if (error) {
                console.error('Erro ao criar o Center:', error);
            }
        });
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    saveCenter() {
        const payload = {
            name: this.center.name,
            address: this.center.address,
            city: this.center.city,
            phone: this.center.phone,
            active: this.center.active
        };

        console.log(payload)

        // Monitorar o estado de carregamento e sucesso
        this.loading$.subscribe((loading) => {
            if (!loading) {
                this.hide();
                this.resetForm();
            }
        });
    }

    resetForm() {
        this.center = {
            name: '',
            address: '',
            city: '',
            phone: '',
            active: true
        };
    }
}
