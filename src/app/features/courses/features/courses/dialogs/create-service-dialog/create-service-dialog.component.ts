import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Service } from 'src/app/core/models/course/service';
import { Store } from '@ngrx/store';
import * as ServiceActions from 'src/app/core/store/course/actions/service.actions';
import { ServiceState } from 'src/app/core/store/course/reducers/service.reducer';
import { Observable } from 'rxjs';
import { selectServiceError, selectServiceLoading } from 'src/app/core/store/course/selectors/service.selector';


@Component({
    selector: 'app-create-service-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule
    ],
    templateUrl: './create-service-dialog.component.html'
})
export class CreateServiceDialogComponent implements OnInit {

    visible: boolean = false;

    service: Partial<Service> = {
        name: '',
        description: '',
        value: 0,
        active: true,
        type: 'REGULAR_COURSE'
    };

    typeOptions: SelectItem[] = [
        { label: 'Curso Regular', value: 'REGULAR_COURSE' },
        { label: 'Curso Intensivo', value: 'INTENSIVE_COURSE' },
        { label: 'Aulas Particulares', value: 'PRIVATE_LESSONS' },
        { label: 'Workshop', value: 'WORKSHOP' },
        { label: 'Preparação para exames', value: 'EXAM_PREPARATION' }
    ];

    activeOptions: SelectItem[] = [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
    ];

    loading$: Observable<boolean>;
    error$: Observable<any>;


    constructor(private store: Store<ServiceState>) {
            this.loading$ = this.store.select(selectServiceLoading);
            this.error$ = this.store.select(selectServiceError);
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

    saveService() {

        const payload = {
            name: this.service.name,
            description: this.service.description,
            value: this.service.value,
            type: this.service.type,
            active: this.service.active
        };

        console.log(payload)

        this.store.dispatch(ServiceActions.createService({ service: payload}));
        // Monitorar o estado de carregamento e sucesso
        this.store.select(selectServiceError).subscribe(error => {
            if (!error) {
              this.hide();
              this.resetForm();
            }
        });
    }

    resetForm() {
        this.service = {
            name: '',
            description: '',
            value: 0,
            active: true,
            type: 'REGULAR_COURSE'
        };
    }
}
