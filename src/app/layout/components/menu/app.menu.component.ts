import {OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {AppMenuitemComponent} from './app.menuitem.component';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    imports: [
        CommonModule,
        AppMenuitemComponent
    ]
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    ngOnInit() {
        this.model = [
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
                    },
                    {
                        label: 'Aulas',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/schoolar/lessons'],
                    },
                    {
                        label: 'Turmas',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/schoolar/classes'],
                    },
                    {
                        label: 'Calendário',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/schoolar/calendar'],
                    },
                    {
                        label: 'Avaliações',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/schoolar/assessments'],
                    },
                    {
                        label: 'Certificados',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/schoolar/certificates'],
                    },
                    {
                        label: 'Materiais',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/schoolar/materials'],
                    },
                    {
                        label: 'Niveis',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/schoolar/levels'],
                    },
                    {
                        label: 'Unidades',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/schoolar/units'],
                    },
                    {
                        label: 'Relatórios',
                        icon: 'pi pi-fw pi-file-pdf',
                        routerLink: ['/schoolar/reports'],
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/schoolar/settings'],
                    },
                ],
            },
            {
                label: 'Financeiro',
                icon: 'pi pi-fw pi-file-pdf',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/finances/dashboards'],
                    },
                    {
                        label: 'Facturas pró-forma',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/finances/invoices'],
                    },
                    {
                        label: 'Pagamentos',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/finances/payments'],
                    },
                    {
                        label: 'Contratos',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/finances/contracts'],
                    },
                    {
                        label: 'Relatórios',
                        icon: 'pi pi-fw pi-file-pdf',
                        routerLink: ['/finances/reports'],
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/finances/settings'],
                    },
                ],
            },
            {
                label: 'Empresa',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/corporate/dashboards'],
                    },
                    {
                        label: 'Centros',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/corporate/centers'],
                    },
                    {
                        label: 'Relatório',
                        icon: 'pi pi-fw pi-file-pdf',
                        routerLink: ['/corporate/reports'],
                    },
                    {
                        label: 'Administração',
                        icon: 'pi pi-fw pi-cog',
                        items: [
                            {
                                label: 'Usuários',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/corporate/employees'],
                            },
                            {
                                label: 'Funções',
                                icon: 'pi pi-fw pi-id-card',
                                routerLink: ['/corporate/roles'],
                            },
                            {
                                label: 'Permissões',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/corporate/permissions'],
                            },
                        ]
                    },

                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/corporate/settings'],
                    },
                ],
            },
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Alertas',
                        icon: 'pi pi-fw pi-bell',
                        routerLink: ['/settings/alerts'],
                    },
                    {
                        label: 'Info Geral',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/settings/general-info'],
                    },
                    {
                        label: 'Suporte',
                        icon: 'pi pi-fw pi-question-circle',
                        routerLink: ['/settings/support'],
                    },
                ],
            },
        ];
    }
}
