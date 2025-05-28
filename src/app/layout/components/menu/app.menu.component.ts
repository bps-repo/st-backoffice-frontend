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
                        routerLink: ['/schoolar/dashboard'],
                    },
                    {
                        label: 'Alunos',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Dashboard',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/schoolar/students/dashboard'],
                            },
                            {
                                label: 'Lista de Alunos',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/schoolar/students'],
                            },
                            {
                                label: 'Adicionar ao Centro',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/schoolar/students/add-to-center'],
                            },
                            {
                                label: 'Adicionar à Turma',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/schoolar/students/add-to-class'],
                            },
                            {
                                label: 'Criar Contrato',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/schoolar/students/create-contract'],
                            },
                            {
                                label: 'Progresso de Unidades',
                                icon: 'pi pi-fw pi-chart-bar',
                                routerLink: ['/schoolar/students/unit-progress'],
                            },
                            {
                                label: 'Ações em Massa',
                                icon: 'pi pi-fw pi-cog',
                                routerLink: ['/schoolar/students/bulk-actions'],
                            },
                        ],
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
                        routerLink: ['/schoolar/reviews'],
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
                label: 'Cursos',
                icon: 'pi pi-sitemap',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/courses/dashboard'],
                    },
                    {
                        label: 'Niveis',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/courses/levels'],
                    },
                    {
                        label: 'Unidades',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/courses/units'],
                    },
                    {
                        label: 'Relatórios',
                        icon: 'pi pi-fw pi-file-pdf',
                        routerLink: ['/courses/reports'],
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/courses/settings'],
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
                        routerLink: ['/invoices/dashboard'],
                    },
                    {
                        label: 'Facturas pró-forma',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/invoices/invoices'],
                    },
                    {
                        label: 'Pagamentos',
                        icon: 'pi pi-fw pi-file',
                        items: [
                            {
                                label: 'Dashboard',
                                icon: 'pi pi-fw pi-th-large',
                                routerLink: ['/payments/dashboard'],
                            },
                            {
                                label: 'Lista de Pagamentos',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/payments'],
                            },
                            {
                                label: 'Relatórios',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/payments/reports'],
                            },
                        ],
                    },
                    {
                        label: 'Relatórios',
                        icon: 'pi pi-fw pi-file-pdf',
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-cog',
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
                        routerLink: ['/corporate/dashboard'],
                    },
                    {
                        label: 'Cursos',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/courses/courses'],
                    },
                    {
                        label: 'Centros',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/corporate/centers'],
                    },
                    {
                        label: 'Contratos',
                        icon: 'pi pi-fw pi-wallet',
                    },
                    {
                        label: 'Funcionários',
                        icon: 'pi pi-fw pi-users',
                    },
                    {
                        label: 'Relatório',
                        icon: 'pi pi-fw pi-file-pdf',
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-cog',
                    },
                ],
            },
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Utilizadores',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/settings/users-management'],
                    },
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
            {
                label: 'Administração',
                icon: 'pi pi-fw pi-shield',
                items: [

                    {
                        label: 'Gestão de Utilizadores',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/admin/user-management'],
                    },
                ],
            },
        ];
    }
}
