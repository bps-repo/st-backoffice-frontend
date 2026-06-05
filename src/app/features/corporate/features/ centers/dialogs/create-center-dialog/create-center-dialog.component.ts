import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Observable, finalize } from 'rxjs';
import { CreateCenter } from 'src/app/core/models/corporate/center';
import { Municipality, Province } from 'src/app/core/models/location/location';
import { LocationService } from 'src/app/core/services/location.service';
import { CenterState } from '../../../../../../core/store/corporate/center/center.state';
import * as CenterSeletors from '../../../../../../core/store/corporate/center/centers.selector';
import { CenterActions } from '../../../../../../core/store/corporate/center/centers.actions';
import { ShowToastErrorService } from 'src/app/shared/services/show-toast-error-service';

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
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './create-center-dialog.component.html',
})
export class CreateCenterDialogComponent implements OnInit {
    private store = inject<Store<CenterState>>(Store);
    private actions$ = inject(Actions);
    private messageService = inject(MessageService);
    private locationService = inject(LocationService);
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);

    visible = false;

    name = '';
    email = '';
    phone = '';
    provinceName: string | null = null;
    municipalityId: string | null = null;

    readonly provinces = signal<Province[]>([]);
    readonly municipalities = signal<Municipality[]>([]);
    readonly loadingProvinces = signal(false);
    readonly loadingMunicipalities = signal(false);

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

    loading$: Observable<boolean>;

    constructor() {
        this.loading$ = this.store.select(CenterSeletors.selectLoadingCreateCenter);
    }

    ngOnInit(): void {
        this.actions$
            .pipe(ofType(CenterActions.createCenterSuccess), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.messageService.add({
                    life: 5000,
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Centro criado com sucesso.',
                });
                this.hide();
                this.resetForm();
            });

        this.actions$
            .pipe(ofType(CenterActions.createCenterFailure), takeUntilDestroyed(this.destroyRef))
            .subscribe(({ error }) => {
                ShowToastErrorService.showToastError(
                    'Erro ao criar centro',
                    error,
                    this.messageService,
                );
            });
    }

    show(): void {
        this.store.dispatch(CenterActions.clearCentersErrors());
        this.visible = true;
        this.loadProvinces();
    }

    hide(): void {
        this.visible = false;
    }

    onProvinceChange(provinceName: string | null): void {
        this.provinceName = provinceName;
        this.municipalityId = null;
        this.municipalities.set([]);

        if (!provinceName) {
            return;
        }

        this.loadingMunicipalities.set(true);
        this.locationService
            .getProvinceById(provinceName)
            .pipe(
                finalize(() => {
                    this.loadingMunicipalities.set(false);
                    this.cdr.detectChanges();
                }),
            )
            .subscribe({
                next: (province) => {
                    this.municipalities.set(province.municipalities ?? []);
                    this.cdr.detectChanges();
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

    saveCenter(form: NgForm): void {
        form.control.markAllAsTouched();

        if (form.invalid || !this.municipalityId) {
            this.messageService.add({
                life: 5000,
                severity: 'error',
                summary: 'Validação',
                detail: 'Nome, telefone, província e município são obrigatórios.',
            });
            return;
        }

        const payload: CreateCenter = {
            name: this.name.trim(),
            municipalityId: this.municipalityId,
            phone: this.phone.trim(),
        };

        const email = this.email.trim();
        if (email) {
            payload.email = email;
        }

        this.store.dispatch(CenterActions.createCenter({ center: payload }));
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
                    this.cdr.detectChanges();
                }),
            )
            .subscribe({
                next: (provinces) => {
                    this.provinces.set(provinces);
                    this.cdr.detectChanges();
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

    resetForm(): void {
        this.name = '';
        this.email = '';
        this.phone = '';
        this.provinceName = null;
        this.municipalityId = null;
        this.municipalities.set([]);
    }
}
