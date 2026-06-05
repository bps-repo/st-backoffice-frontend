import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { combineLatest, forkJoin, map, Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Center, UpdateCenter } from 'src/app/core/models/corporate/center';
import { Municipality, Province } from 'src/app/core/models/location/location';
import { LocationService } from 'src/app/core/services/location.service';
import { ShowToastErrorService } from 'src/app/shared/services/show-toast-error-service';
import { CenterActions } from '../../../../../../core/store/corporate/center/centers.actions';
import * as CenterSelectors from '../../../../../../core/store/corporate/center/centers.selector';

@Component({
    selector: 'app-center-student',
    templateUrl: './detail.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        DropdownModule,
        ButtonModule,
        ProgressSpinnerModule,
        ToastModule,
    ],
    providers: [MessageService],
})
export class DetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private store = inject(Store);
    private actions$ = inject(Actions);
    private messageService = inject(MessageService);
    private locationService = inject(LocationService);
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);

    centerId = '';
    name = '';
    email = '';
    address = '';
    phone = '';
    active = true;
    provinceName: string | null = null;
    municipalityId: string | null = null;

    readonly provinces = signal<Province[]>([]);
    readonly municipalities = signal<Municipality[]>([]);
    readonly loadingProvinces = signal(false);
    readonly loadingMunicipalities = signal(false);
    readonly resolvingLocation = signal(false);

    readonly provinceOptions = computed(() =>
        this.provinces().map((province) => ({
            label: province.name,
            value: province.name,
        })),
    );

    readonly municipalityOptions = computed(() =>
        this.municipalities().map((municipality) => ({
            label: municipality.name,
            value: municipality.id,
        })),
    );

    readonly activeOptions = [
        { label: 'Sim', value: true },
        { label: 'Não', value: false },
    ];

    center$: Observable<Center | null> = of(null);
    loading$: Observable<boolean> = of(false);
    private currentCenter: Center | null = null;

    constructor() {
        this.center$ = this.store.select(CenterSelectors.selectSelectedCenterId);
        this.loading$ = combineLatest([
            this.store.select(CenterSelectors.selectLoadingCenters),
            this.store.select(CenterSelectors.selectLoadingUpdateCenter),
            toObservable(this.resolvingLocation),
        ]).pipe(
            map(([loading, loadingUpdate, resolvingLocation]) => loading || loadingUpdate || resolvingLocation),
        );
    }

    ngOnInit(): void {
        this.loadProvinces();

        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.centerId = params['id'];
            this.loadCenter();
        });

        this.center$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((center) => {
            if (!center) {
                return;
            }

            this.currentCenter = center;
            this.populateForm(center);
            this.resolveLocation(center);
        });

        this.actions$
            .pipe(ofType(CenterActions.updateCenterSuccess), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.messageService.add({
                    life: 5000,
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Centro atualizado com sucesso.',
                });
            });

        this.actions$
            .pipe(ofType(CenterActions.updateCenterFailure), takeUntilDestroyed(this.destroyRef))
            .subscribe(({ error }) => {
                ShowToastErrorService.showToastError(
                    'Erro ao atualizar centro',
                    error,
                    this.messageService,
                );
            });
    }

    loadCenter(): void {
        this.store.dispatch(CenterActions.loadCenter({ id: this.centerId }));
    }

    onProvinceChange(provinceName: string | null): void {
        this.provinceName = provinceName;
        this.municipalityId = null;
        this.municipalities.set([]);

        if (!provinceName) {
            return;
        }

        this.loadMunicipalities(provinceName);
    }

    saveCenter(form: NgForm): void {
        form.control.markAllAsTouched();

        if (form.invalid || !this.municipalityId) {
            this.messageService.add({
                life: 5000,
                severity: 'error',
                summary: 'Validação',
                detail: 'Nome, telefone, endereço, província e município são obrigatórios.',
            });
            return;
        }

        const payload: UpdateCenter = {
            name: this.name.trim(),
            address: this.address.trim(),
            municipalityId: this.municipalityId,
            phone: this.phone.trim(),
            active: this.active,
        };

        const email = this.email.trim();
        if (email) {
            payload.email = email;
        }

        this.store.dispatch(CenterActions.updateCenter({ id: this.centerId, center: payload }));
    }

    downloadCenterDetails(): void {
        console.log('Downloading center details');
        alert('Download dos detalhes do Centro iniciado');
    }

    sendCenterDetails(): void {
        console.log('Sending center details');
        alert('Detalhes do Centro enviados');
    }

    private populateForm(center: Center): void {
        const nextMunicipalityId = center.municipalityId ?? null;
        const municipalityChanged = this.municipalityId !== nextMunicipalityId;

        this.name = center.name;
        this.email = center.email ?? '';
        this.address = center.address ?? '';
        this.phone = center.phone;
        this.active = center.active ?? true;
        this.municipalityId = nextMunicipalityId;

        if (municipalityChanged) {
            this.provinceName = null;
            this.municipalities.set([]);
        }

        this.cdr.markForCheck();
    }

    private resolveLocation(center: Center): void {
        if (!center.municipalityId || this.provinceName || this.resolvingLocation()) {
            return;
        }

        const provinces = this.provinces();
        if (!provinces.length) {
            return;
        }

        this.resolvingLocation.set(true);
        forkJoin(
            provinces.map((province) =>
                this.locationService.getProvinceById(province.name).pipe(
                    map((loadedProvince) => ({
                        provinceName: loadedProvince.name,
                        municipalities: loadedProvince.municipalities ?? [],
                    })),
                ),
            ),
        )
            .pipe(
                finalize(() => {
                    this.resolvingLocation.set(false);
                    this.cdr.markForCheck();
                }),
            )
            .subscribe({
                next: (results) => {
                    const match = results.find((result) =>
                        result.municipalities.some((municipality) => municipality.id === center.municipalityId),
                    );

                    if (!match) {
                        return;
                    }

                    this.provinceName = match.provinceName;
                    this.municipalities.set(match.municipalities);
                    this.cdr.markForCheck();
                },
                error: (error) => {
                    ShowToastErrorService.showToastError(
                        'Erro ao carregar localização',
                        error,
                        this.messageService,
                    );
                },
            });
    }

    private loadProvinces(): void {
        if (this.provinces().length) {
            return;
        }

        this.loadingProvinces.set(true);
        this.locationService
            .getProvinces()
            .pipe(
                finalize(() => {
                    this.loadingProvinces.set(false);
                    this.cdr.markForCheck();
                }),
            )
            .subscribe({
                next: (provinces) => {
                    this.provinces.set(provinces);
                    if (this.currentCenter) {
                        this.resolveLocation(this.currentCenter);
                    }
                    this.cdr.markForCheck();
                },
                error: (error) => {
                    ShowToastErrorService.showToastError(
                        'Erro ao carregar províncias',
                        error,
                        this.messageService,
                    );
                },
            });
    }

    private loadMunicipalities(provinceName: string): void {
        this.loadingMunicipalities.set(true);
        this.locationService
            .getProvinceById(provinceName)
            .pipe(
                finalize(() => {
                    this.loadingMunicipalities.set(false);
                    this.cdr.markForCheck();
                }),
            )
            .subscribe({
                next: (province) => {
                    this.municipalities.set(province.municipalities ?? []);
                    this.cdr.markForCheck();
                },
                error: (error) => {
                    ShowToastErrorService.showToastError(
                        'Erro ao carregar municípios',
                        error,
                        this.messageService,
                    );
                },
            });
    }
}
