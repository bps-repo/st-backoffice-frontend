import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as UnitActions from 'src/app/core/store/course/actions/unit.actions';
import { selectSelectedUnit, selectUnitLoading } from 'src/app/core/store/course/selectors/unit.selector';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { Unit } from 'src/app/core/models/course/unit';

@Component({
    selector: 'app-unit-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule, SkeletonModule, InputTextModule, InputTextareaModule, ButtonModule]
})
export class DetailComponent implements OnInit {
    unitId: string = '';
    unit$: Observable<Unit | null>;
    unit: Unit | null = null;
    loading$: Observable<boolean>;
    loading: boolean = true;

    constructor(private route: ActivatedRoute, private store: Store) {
        this.unit$ = this.store.select(selectSelectedUnit);
        this.loading$ = this.store.select(selectUnitLoading);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.unitId = params['id'];
            this.loadUnit();
        });

        // Subscribe to unit and loading observables
        this.unit$.subscribe(unit => {
            this.unit = unit;
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });
    }

    loadUnit(): void {
        // Dispatch action to load the selected unit
        this.store.dispatch(UnitActions.loadUnit({ id: this.unitId }));
    }

    downloadUnitDetails(): void {
        // Simulação de download dos detalhes da unidade
        console.log('Downloading unit details:', this.unit);
        alert('Download dos detalhes da Unidade iniciado');
    }

    sendUnitDetails(): void {
        // Simulação de envio dos detalhes da unidade
        console.log('Sending unit details:', this.unit?.name);
        alert('Detalhes da Unidade enviados para ' + this.unit?.name);
    }
}
