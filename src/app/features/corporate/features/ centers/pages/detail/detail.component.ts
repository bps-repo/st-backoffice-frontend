import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {SelectItem} from 'primeng/api';
import {combineLatest, Observable, of} from 'rxjs';
import {DropdownModule} from 'primeng/dropdown';
import {SkeletonModule} from 'primeng/skeleton';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ButtonModule} from 'primeng/button';
import {Center} from 'src/app/core/models/corporate/center';
import {FormsModule} from '@angular/forms';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import * as CenterSelectors from "../../../../../../core/store/corporate/center/centers.selector";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";
import {map} from "rxjs/operators";
import {ToastModule} from "primeng/toast";

@Component({
    selector: 'app-center-student',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule,
        SkeletonModule,
        InputTextModule,
        DropdownModule,
        FormsModule,
        InputTextareaModule,
        ButtonModule,
        ProgressSpinnerModule, ToastModule]
})
export class DetailComponent implements OnInit {

    centerId: string = '';
    editableCenter: Center | null = null;
    center$: Observable<Center | null> = of();
    center: Center | null = null;
    loading$: Observable<boolean> = of(false);
    error$: Observable<any> = of(null);

    activeOptions: SelectItem[] = [
        {label: 'Yes', value: true},
        {label: 'No', value: false}
    ];

    constructor(private route: ActivatedRoute, private store: Store) {
        this.center$ = this.store.select(CenterSelectors.selectSelectedCenterId);

        this.error$ = this.store.select(CenterSelectors.selectErrorUpdateCenter);

        this.loading$ = combineLatest([
            this.store.select(CenterSelectors.selectLoadingCenters),
            this.store.select(CenterSelectors.selectLoadingUpdateCenter),
        ]).pipe(
            map(([loading, loadingCreate]) => loading || loadingCreate)
        );
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.centerId = params['id'];
            this.loadCenter();
        });

        this.center$.subscribe(center => {
            this.center = center;
            this.editableCenter = center ? {...center} : null;
        });
    }

    loadCenter(): void {
        this.store.dispatch(CenterActions.loadCenter({id: this.centerId}));
    }

    editCenter(): void {
        if (this.editableCenter) {
            const updatedCenter: Partial<Center> = {
                name: this.editableCenter.name,
                email: this.editableCenter.email,
                address: this.editableCenter.address,
                city: this.editableCenter.city,
                phone: this.editableCenter.phone,
                active: this.editableCenter.active
            };

            this.store.dispatch(CenterActions.updateCenter({id: this.centerId, center: updatedCenter}));
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
