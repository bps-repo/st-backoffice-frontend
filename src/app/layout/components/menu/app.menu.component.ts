import { inject, OnInit, OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { AppMenuitemComponent } from './app.menuitem.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUserPermissionNames } from 'src/app/core/store/auth/auth.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    imports: [
        CommonModule,
        AppMenuitemComponent
    ]
})
export class AppMenuComponent implements OnInit, OnDestroy {
    model: any[] = [];

    private store = inject(Store);
    private destroy$ = new Subject<void>();

    private permissionSet = new Set<string>();

    constructor() {}


    ngOnInit() {
        // Listen to user permissions from NgRx state to refresh menu reactively
        this.store.select(selectUserPermissionNames).pipe(
            takeUntil(this.destroy$)
        ).subscribe(permissionNames => {
            this.permissionSet = new Set(permissionNames);
            console.log('permissionSet from NgRx', this.permissionSet);
            this.model = this.buildMenu();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }


    private buildMenu(): any[] {
        return this.model = [
            {
                label: 'Escolar',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/schoolar/dashboards'],
                    },
                    {
                        label: 'Alunos',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/schoolar/students'],
                        visible: this.hasPermission('students.view')
                    },
                    {
                        label: 'Aulas',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/schoolar/lessons'],
                        visible: this.hasPermission('lessons.view')
                    },
                    {
                        label: 'Marcação de Aulas',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/schoolar/lessons/schedule'],
                        visible: this.hasPermission('lessons.manage')
                    },
                    {
                        label: 'Calendário',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/schoolar/calendar'],
                        visible: this.hasPermission('lessons.view')
                    },
                    {
                        label: 'Avaliações',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/schoolar/assessments'],
                        visible: this.hasPermission('assessments.view')
                    },
                    {
                        label: 'Materiais didáticos',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/schoolar/materials'],
                        visible: this.hasPermission('materials.view')
                    },
                    {
                        label: 'Niveis',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/schoolar/levels'],
                        visible: this.hasPermission('levels.view')
                    },
                    {
                        label: 'Relatórios',
                        icon: 'pi pi-fw pi-file-pdf',
                        routerLink: ['/schoolar/reports'],
                        visible: this.hasPermission('schoolar.reports.view')
                    },
                ],
            },
            {
                label: 'Financeiro',
                icon: 'pi pi-fw pi-file-pdf',
                visible: this.hasPermission('Manage Attendance Automation'),
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/finances/dashboards'],
                        visible: this.hasPermission('finance.dashboard.view')
                    },
                    {
                        label: 'Gestão de Contratos',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/finances/contracts'],
                        visible: this.hasPermission('contracts.view')
                    },
                    {
                        label: 'Vendas Avulsas',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/finances/sales'],
                        visible: this.hasPermission('sales.view')
                    },
                    {
                        label: 'Gestão de Tarefas',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/settings/tasks'],
                    },
                    // {
                    //     label: 'Relatórios',
                    //     icon: 'pi pi-fw pi-file-pdf',
                    //     routerLink: ['/finances/reports'],
                    //     visible: this.hasPermission('reports.finance.view')
                    // },
                ],
            },
            {
                label: 'Empresa',
                icon: 'pi pi-fw pi-users',
                visible: this.hasPermission('settings.corporate.manage'),
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/corporate/dashboards'],
                        visible: this.hasPermission('corporate.dashboard.view')
                    },
                    {
                        label: 'Centros',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/corporate/centers'],
                        visible: this.hasPermission('centers.view')
                    },
                    // {
                    //     label: 'Relatório',
                    //     icon: 'pi pi-fw pi-file-pdf',
                    //     routerLink: ['/corporate/reports'],
                    //     visible: this.hasPermission('reports.corporate.view')
                    // },
                    {
                        label: 'Administração',
                        icon: 'pi pi-fw pi-cog',
                        visible: this.hasPermission('users.manage'),
                        items: [
                            {
                                label: 'Usuários',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/corporate/employees'],
                                visible: this.hasPermission('users.view')
                            },
                            {
                                label: 'Funções',
                                icon: 'pi pi-fw pi-id-card',
                                routerLink: ['/corporate/roles'],
                                visible: this.hasPermission('roles.view')
                            },
                            {
                                label: 'Permissões',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/corporate/permissions'],
                                visible: this.hasPermission('permissions.view')
                            },
                        ]
                    },
                ],
            },
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-cog',
                visible: this.hasPermission('settings.corporate.manage'),
                items: [
                    {
                        label: 'Alertas',
                        icon: 'pi pi-fw pi-bell',
                        routerLink: ['/settings/alerts'],
                        visible: this.hasPermission('settings.alerts.manage')
                    },
                    {
                        label: 'Info Geral',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/settings/general-info'],
                        visible: this.hasPermission('settings.general.manage')
                    },
                    {
                        label: 'Suporte',
                        icon: 'pi pi-fw pi-question-circle',
                        routerLink: ['/settings/support'],
                        visible: this.hasPermission('settings.support.manage')
                    },
                    {
                        label: 'Relatórios',
                        icon: 'pi pi-fw pi-file-pdf',
                        routerLink: ['/settings/reports'],
                        visible: this.hasPermission('reports.settings.view')
                    },
                    {
                        label: 'Exportar',
                        icon: 'pi pi-fw pi-file-pdf',
                        routerLink: ['/settings/export'],
                        visible: this.hasPermission('reports.settings.export')
                    },
                    {
                        label: 'Importar',
                        icon: 'pi pi-fw pi-file-pdf',
                        routerLink: ['/settings/import'],
                        visible: this.hasPermission('reports.settings.import')
                    }
                ],
            },
        ]
    }

    private hasPermission(permission: string): boolean {
        return this.permissionSet.has(permission);
    }
}
