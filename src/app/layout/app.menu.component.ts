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
                label: 'Dashboards',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Visão Geral',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'],
                    },
                    // {
                    //     label: 'Balanço',
                    //     icon: 'pi pi-fw pi-image',
                    //     routerLink: ['/dashboard-banking']
                    // }
                ],
            },
            {
                label: 'Produtos e Serviços',
                icon: 'pi pi-th-large',
                items: [
                    {
                        label: 'Produtos',
                        icon: 'pi pi-fw pi-calendar',
                    },
                    {
                        label: 'Pacotes',
                        icon: 'pi pi-fw pi-calendar',
                    },
                    {
                        label: 'Produtos em Stock',
                        icon: 'pi pi-fw pi-envelope',
                    },
                    {
                        label: 'Historico de produtos',
                        icon: 'pi pi-fw pi-envelope',
                    },
                ],
            },
            {
                label: 'Gestão de Processos',
                icon: 'pi pi-fw pi-star-fill',
                items: [
                    {
                        label: 'Overlay',
                        icon: 'pi pi-fw pi-clone',
                        routerLink: ['/uikit/overlay'],
                    },
                    {
                        label: 'Media',
                        icon: 'pi pi-fw pi-image',
                        routerLink: ['/uikit/media'],
                    },
                ],
            },
            {
                label: 'Faturação e Vendas',
                icon: 'pi pi-fw pi-star-fill',
                items: [
                    {
                        label: 'Overlay',
                        icon: 'pi pi-fw pi-clone',
                        routerLink: ['/uikit/overlay'],
                    },
                    {
                        label: 'Media',
                        icon: 'pi pi-fw pi-image',
                        routerLink: ['/uikit/media'],
                    },
                    {
                        label: 'Chart',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/uikit/charts'],
                    },
                    {
                        label: 'Misc',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/uikit/misc'],
                    },
                ],
            },
            {
                label: 'Contabilidade',
                icon: 'pi pi-fw pi-prime',
                items: [
                    {
                        label: 'Free Blocks',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/blocks'],
                    },
                    {
                        label: 'All Blocks',
                        icon: 'pi pi-fw pi-globe',
                        url: ['https://www.primefaces.org/primeblocks-ng'],
                        target: '_blank',
                    },
                ],
            },
            {
                label: 'Configurações',
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
                label: 'Start',
                icon: 'pi pi-fw pi-download',
                items: [
                    {
                        label: 'Buy Now',
                        icon: 'pi pi-fw pi-shopping-cart',
                        url: ['https://www.primefaces.org/store'],
                    },
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-info-circle',
                        routerLink: ['/documentation'],
                    },
                ],
            },
        ];
    }
}
