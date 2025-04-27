import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

// Layout and Services
import { AppSidebarComponent } from './components/sidebar/app.sidebar.component';
import { AppTopbarComponent } from './components/topbar/app.topbar.component';
import { AppProfileSidebarComponent } from './components/sidebar/app.profilesidebar.component';
import { AppMenuComponent } from './components/menu/app.menu.component';
import { AppMenuitemComponent } from './components/menu/app.menuitem.component';
import { AppBreadcrumbComponent } from './components/breadcrumb/app.breadcrumb.component';

import { LayoutService } from './service/app.layout.service';
import { MenuService } from './components/menu/app.menu.service';

import { AppConfigModule } from './config/app.config.module';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,

        // PrimeNG
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        TooltipModule,
        RippleModule,
        ButtonModule,

        // AppConfig
        AppConfigModule,

        // Components usados no layout
        AppSidebarComponent,
        AppTopbarComponent,
        AppProfileSidebarComponent,
        AppBreadcrumbComponent,
    ],
    templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent implements OnDestroy {
    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;
    menuScrollListener: any;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    @ViewChild(AppTopbarComponent) appTopbar!: AppTopbarComponent;

    constructor(
        private menuService: MenuService,
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    const isOutsideClicked = !(
                        this.appSidebar.el.nativeElement.isSameNode(event.target) ||
                        this.appSidebar.el.nativeElement.contains(event.target) ||
                        this.appTopbar.menuButton.nativeElement.isSameNode(event.target) ||
                        this.appTopbar.menuButton.nativeElement.contains(event.target)
                    );
                    if (isOutsideClicked) {
                        this.hideMenu();
                    }
                });
            }

            if ((this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isSlimPlus()) && !this.menuScrollListener) {
                this.menuScrollListener = this.renderer.listen(
                    this.appSidebar.menuContainer.nativeElement,
                    'scroll',
                    () => {
                        if (this.layoutService.isDesktop()) {
                            this.hideMenu();
                        }
                    }
                );
            }

            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    blockBodyScroll(): void {
        document.body.classList?.add('blocked-scroll');
    }

    unblockBodyScroll(): void {
        document.body.classList?.remove('blocked-scroll');
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        this.menuService.reset();

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }

        if (this.menuScrollListener) {
            this.menuScrollListener();
            this.menuScrollListener = null;
        }

        this.unblockBodyScroll();
    }

    get containerClass() {
        const config = this.layoutService.config();
        const state = this.layoutService.state;

        return {
            'layout-light': config.colorScheme === 'light',
            'layout-dim': config.colorScheme === 'dim',
            'layout-dark': config.colorScheme === 'dark',
            'layout-colorscheme-menu': config.menuTheme === 'colorScheme',
            'layout-primarycolor-menu': config.menuTheme === 'primaryColor',
            'layout-transparent-menu': config.menuTheme === 'transparent',
            'layout-overlay': config.menuMode === 'overlay',
            'layout-static': config.menuMode === 'static',
            'layout-slim': config.menuMode === 'slim',
            'layout-slim-plus': config.menuMode === 'slim-plus',
            'layout-horizontal': config.menuMode === 'horizontal',
            'layout-reveal': config.menuMode === 'reveal',
            'layout-drawer': config.menuMode === 'drawer',
            'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.staticMenuMobileActive,
            'p-input-filled': config.inputStyle === 'filled',
            'p-ripple-disabled': !config.ripple,
            'layout-sidebar-active': state.sidebarActive,
            'layout-sidebar-anchored': state.anchored,
        };
    }

    ngOnDestroy() {
        this.overlayMenuOpenSubscription?.unsubscribe();
        this.menuOutsideClickListener?.();
    }
}
