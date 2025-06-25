import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {Observable} from 'rxjs';
import {ButtonModule} from 'primeng/button';
import {TableColumn, GlobalTable} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Center} from 'src/app/core/models/corporate/center';
import {CreateCenterDialogComponent} from '../../dialogs/create-center-dialog/create-center-dialog.component';
import * as CenterSelectors from "../../../../../../core/store/corporate/center/centers.selector";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";
import {RippleModule} from "primeng/ripple";
import {CENTER_COLUMNS} from "../../center.const";
import {DockModule} from "primeng/dock";
import {BadgeModule} from "primeng/badge";

@Component({
    selector: 'app-center-general',
    imports: [CommonModule, GlobalTable, CreateCenterDialogComponent, ButtonModule, ConfirmDialogModule, RippleModule, DockModule, BadgeModule],
    templateUrl: './list.component.html',
    standalone: true,
    providers: [ConfirmationService]
})
export class ListComponent implements OnInit, AfterViewInit {
    @ViewChild(CreateCenterDialogComponent) createCenterDialog!:
        CreateCenterDialogComponent;

    columnTemplates?: { [key: string]: TemplateRef<any> }

    centers$: Observable<Center[]>;

    loading$: Observable<boolean>;

    columns: TableColumn[] = CENTER_COLUMNS;

    size = 15;

    constructor(
        private router: Router,
        private store: Store,
        private confirmationService: ConfirmationService
    ) {
        this.centers$ = this.store.select(CenterSelectors.selectAllCenters)
        this.loading$ = this.store.select(CenterSelectors.selectLoadingCenters);
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.loadCenters();
    }

    loadCenters(): void {
        this.store.dispatch(CenterActions.loadCenters());
    }

    viewDetails(center: Center): void {
        this.router.navigate(['/corporate/centers', center.id]);
    }

    createCenter(): void {
        this.createCenterDialog.show();
    }

    deleteCenter(center: Center): void {
        this.confirmationService.confirm({
            message: `Tem certeza de que deseja excluir o centro "${center.name}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle text-warning',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.store.dispatch(CenterActions.deleteCenter({id: center.id}));
            },
            reject: () => {
                console.log('Ação de exclusão cancelada.');
            }
        });
    }
}
