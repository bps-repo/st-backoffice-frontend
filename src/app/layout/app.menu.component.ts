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
                        icon: 'pi pi-fw pi-home',
                    },
                    {
                        label: 'Alunos',
                        icon: 'pi pi-fw pi-users',
                    },
                    {
                        label: 'Aulas',
                        icon: 'pi pi-fw pi-home',
                    },
                    {
                        label: 'Calendário',
                        icon: 'pi pi-fw pi-home',
                    },
                    {
                        label: 'Matrículas',
                        icon: 'pi pi-fw pi-home',
                    },
                    {
                        label: 'Relatórios',
                        icon: 'pi pi-fw pi-home',
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-home',
                    },
                ],
            },
            {
                label: 'Produtos e Serviços',
                icon: 'pi pi-th-large',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-calendar',
                    },
                    {
                        label: 'Produtos',
                        icon: 'pi pi-fw pi-calendar',
                    },
                    {
                        label: 'Produtos em Stock',
                        icon: 'pi pi-fw pi-calendar',
                    },
                    {
                        label: 'Armazém',
                        icon: 'pi pi-fw pi-envelope',
                    },
                    {
                        label: 'Relatórios',
                        icon: 'pi pi-fw pi-envelope',
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-envelope',
                    },
                ],
            },
            {
                label: 'Facturação',
                icon: 'pi pi-fw pi-star-fill',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-envelope',
                    },
                    {
                        label: 'Facturas',
                        icon: 'pi pi-fw pi-image',
                        routerLink: ['/uikit/media'],
                    },
                    {
                        label: 'Recibos',
                        icon: 'pi pi-fw pi-envelope',
                    },
                    {
                        label: 'Notas de crédito',
                        icon: 'pi pi-fw pi-envelope',
                    },
                    {
                        label: 'Notas de Débito',
                        icon: 'pi pi-fw pi-envelope',
                    },
                    {
                        label: 'Notas de Débito',
                        icon: 'pi pi-fw pi-envelope',
                    },
                    {
                        label: 'POS',
                        icon: 'pi pi-fw pi-envelope',
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-envelope',
                    },
                ],
            },
            {
                label: 'Contabilidade',
                icon: 'pi pi-fw pi-star-fill',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-clone',
                        routerLink: ['/uikit/overlay'],
                    },
                    {
                        label: 'Plano de Contas',
                        icon: 'pi pi-fw pi-image',
                        routerLink: ['/uikit/media'],
                    },
                    {
                        label: 'Reclamações',
                        icon: 'pi pi-fw pi-chart-bar',
                    },
                    {
                        label: 'Relatórios',
                        icon: 'pi pi-fw pi-circle-off',
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-circle-off',
                    },
                ],
            },
            {
                label: 'Recursos Humanos',
                icon: 'pi pi-fw pi-prime',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/blocks'],
                    },
                    {
                        label: 'Funcionários',
                        icon: 'pi pi-fw pi-globe',
                    },
                    {
                        label: 'Processamento Salarial',
                        icon: 'pi pi-fw pi-globe',
                    },
                    {
                        label: 'Folha de Ponto',
                        icon: 'pi pi-fw pi-globe',
                    },
                    {
                        label: 'Relatório',
                        icon: 'pi pi-fw pi-globe',
                    },
                    {
                        label: 'Configurações',
                        icon: 'pi pi-fw pi-globe',
                    },
                ],
            },
            {
                label: 'Comunicação',
                icon: 'pi pi-fw pi-compass',
                items: [
                    {
                        label: 'Gerais',
                        icon: 'pi pi-fw pi-prime',
                        routerLink: ['utilities/icons'],
                    },
                    {
                        label: 'Utilizadores',
                        icon: 'pi pi-users',
                        routerLink: ['utilities/colors'],
                        items: [
                            {
                                label: 'Adicionar utilizador',
                                icon: 'pi pi-user-plus',
                                routerLink: ['profile/create'],
                            },
                            {
                                label: 'Visualizar utilizador',
                                icon: 'pi pi-user-check',
                                routerLink: ['profile/view'],
                            },
                        ],
                    },
                    {
                        label: 'Centros',
                        icon: 'pi pi-fw pi-desktop',
                        url: ['https://www.primefaces.org/primeflex/'],
                        target: '_blank',
                    },
                    {
                        label: 'Sobre o centro',
                        icon: 'pi pi-fw pi-pencil',
                        url: [
                            'https://www.figma.com/file/zQOW0XBXdCTqODzEOqwBtt/Preview-%7C-Apollo-2022?node-id=335%3A21768&t=urYI89V3PLNAZEJG-1/',
                        ],
                        target: '_blank',
                    },
                ],
            },
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-download',
                items: [
                    {
                        label: 'Perfis',
                        icon: 'pi pi-fw pi-shopping-cart',
                    },
                    {
                        label: 'Utilizadores',
                        icon: 'pi pi-fw pi-info-circle',
                    },
                    {
                        label: 'Pagamentos',
                        icon: 'pi pi-fw pi-shopping-cart',
                    },
                    {
                        label: 'E-mails',
                        icon: 'pi pi-fw pi-info-circle',
                    },
                    {
                        label: 'Alertas',
                        icon: 'pi pi-fw pi-info-circle',
                    },
                ],
            },
        ];
    }
}
