import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
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
                        label: 'Professores',
                        icon: 'pi pi-fw pi-users',
                    },
                    {
                        label: 'Aulas',
                        icon: 'pi pi-fw pi-wallet',
                    },
                    {
                        label: 'Calendário',
                        icon: 'pi pi-fw pi-calendar',
                    },
                    {
                        label: 'Matrículas',
                        icon: 'pi pi-fw pi-wallet',
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
                label: 'Produtos e Serviços',
                icon: 'pi pi-sitemap',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                    },
                    {
                        label: 'Produtos',
                        icon: 'pi pi-fw pi-sitemap',
                    },
                    {
                        label: 'Produtos em Stock',
                        icon: 'pi pi-fw pi-shopping-cart',
                    },
                    {
                        label: 'Armazém',
                        icon: 'pi pi-fw pi-shopping-cart',
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
                        label: 'Facturas',
                        icon: 'pi pi-fw pi-file',
                    },
                    {
                        label: 'Recibos',
                        icon: 'pi pi-fw pi-file',
                    },
                    {
                        label: 'Notas de crédito',
                        icon: 'pi pi-fw pi-file',
                    },
                    {
                        label: 'Notas de Débito',
                        icon: 'pi pi-fw pi-file',
                    },
                    {
                        label: 'Notas de Débito',
                        icon: 'pi pi-fw pi-file',
                    },
                    {
                        label: 'POS',
                        icon: 'pi pi-fw pi-globe',
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
                label: 'Contabilidade',
                icon: 'pi pi-fw pi-money-bill',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-th-large',
                    },
                    {
                        label: 'Plano de Contas',
                        icon: 'pi pi-fw pi-money-bill',
                    },
                    {
                        label: 'Reclamações',
                        icon: 'pi pi-fw pi-tag',
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
