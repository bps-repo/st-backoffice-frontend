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
                        routerLink: ['/schoolar/lessons'],
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
                        routerLink: ['/schoolar/dashboard'],
                    },
                    {
                        label: 'Cursos',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/courses/courses'],
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
                        label: 'Pacotes',
                        icon: 'pi pi-fw pi-sitemap',
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
                label: 'Facturação',
                icon: 'pi pi-fw pi-file-pdf',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/schoolar/dashboard'],
                    },
                    {
                        label: 'Facturas pró-forma',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/invoices/invoices'],
                    },
                    {
                        label: 'Recibos',
                        icon: 'pi pi-fw pi-file',
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
                        routerLink: ['/schoolar/dashboard'],
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
                        label: 'Perfis',
                        icon: 'pi pi-fw pi-user',
                    },
                    {
                        label: 'Utilizadores',
                        icon: 'pi pi-fw pi-users',
                    },
                    {
                        label: 'Alertas',
                        icon: 'pi pi-fw pi-bell',
                    },
                    {
                        label: 'Info Geral',
                        icon: 'pi pi-fw pi-building',
                    },
                    {
                        label: 'Suporte',
                        icon: 'pi pi-fw pi-question-circle',
                    },
                ],
            },
        ];
    }
}
