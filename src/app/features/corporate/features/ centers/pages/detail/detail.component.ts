import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import * as CenterActions from 'src/app/core/store/corporate/actions/center.actions';
import { selectSelectedCenter, selectCenterLoading } from 'src/app/core/store/corporate/selectors/center.selector';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { Center } from 'src/app/core/models/corporate/center';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-center-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule,
        SkeletonModule,
        InputTextModule,
        DropdownModule,
        FormsModule,
        InputTextareaModule,
        ButtonModule]
})
export class DetailComponent implements OnInit {

    centerId: string = '';
    editableCenter: Center | null = null;
    center$: Observable<Center | null>;
    center: Center | null = null;
    loading$: Observable<boolean>;
    loading: boolean = true;

    activeOptions: SelectItem[] = [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
    ];

    constructor(private route: ActivatedRoute, private store: Store) {
        this.center$ = this.store.select(selectSelectedCenter);
        this.loading$ = this.store.select(selectCenterLoading);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.centerId = params['id'];
            this.loadCenter();
        });

        // Subscribe to center and loading observables
        this.center$.subscribe(center => {
            this.center = center;
            // Criar uma cópia mutável do objeto center
            this.editableCenter = center ? { ...center } : null;
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });
    }

    loadCenter(): void {
        this.store.dispatch(CenterActions.loadCenter({ id: this.centerId }));
    }

    editCenter(): void {
        if (this.editableCenter) {
            const updatedCenter: Partial<Center> = {
                name: this.editableCenter.name,
                address: this.editableCenter.address,
                city: this.editableCenter.city,
                phone: this.editableCenter.phone,
                active: this.editableCenter.active
            };

            this.store.dispatch(CenterActions.updateCenter({ id: this.centerId, center: updatedCenter }));
        }
    }

    downloadCenterDetails(): void {
        // Simulação de download dos detalhes do center
        console.log('Downloading center details:', this.center);
        alert('Download dos detalhes do Center iniciado');
    }

    sendCenterDetails(): void {
        // Simulação de envio dos detalhes do center
        console.log('Sending center details:', this.center?.name);
        alert('Detalhes do Center enviados para ' + this.center?.name);
    }
}
