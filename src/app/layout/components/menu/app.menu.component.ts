import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AppMenuitemComponent } from './app.menuitem.component';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    imports: [
        CommonModule,
        AppMenuitemComponent
    ],
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
                        routerLink: ['/modules/schoolar/dashboard'],
                    },
                    {
                        label: 'Alunos',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/modules/schoolar/students'],
                    },
                    {
                        label: 'Entidades',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/modules/schoolar/entities'],
                    },
                    {
                        label: 'Aulas',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/modules/schoolar/classes'],
                    },
                    {
                        label: 'Calendário',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/modules/schoolar/calendar'],
                    },
                    {
                        label: 'Avaliações',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/modules/schoolar/reviews'],
                    },
                    {
                        label: 'Certificados',
                        icon: 'pi pi-fw pi-wallet',
                    },
                    {
                        label: 'Contratos',
                        icon: 'pi pi-fw pi-wallet',
                    },
                    {
                        label: 'Materiais',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/modules/schoolar/materials'],
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
                label: 'Cursos',
                icon: 'pi pi-sitemap',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                    },
                    {
                        label: 'Cursos',
                        icon: 'pi pi-fw pi-sitemap',
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
                    },
                    {
                        label: 'Facturas pró-forma',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/modules/invoices/invoices'],
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
                label: 'Recursos Humanos',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/blocks'],
                    },
                    {
                        label: 'Funcionários',
                        icon: 'pi pi-fw pi-users',
                    },
                    {
                        label: 'Processamento Salarial',
                        icon: 'pi pi-fw pi-money-bill',
                    },
                    {
                        label: 'Folha de Ponto',
                        icon: 'pi pi-fw pi-globe',
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
                label: 'Comunicação',
                icon: 'pi pi-fw pi-comments',
                items: [
                    {
                        label: 'Chat',
                        icon: 'pi pi-fw pi-comments',
                    },
                    {
                        label: 'Notificações',
                        icon: 'pi pi-bell',
                    },
                    {
                        label: 'Comunicados',
                        icon: 'pi pi-fw pi-comment',
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
                        label: 'Pagamentos',
                        icon: 'pi pi-fw pi-money-bill',
                    },
                    {
                        label: 'E-mails',
                        icon: 'pi pi-fw pi-at',
                    },
                    {
                        label: 'Alertas',
                        icon: 'pi pi-fw pi-bell',
                    },
                    {
                        label: 'Empresa',
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
