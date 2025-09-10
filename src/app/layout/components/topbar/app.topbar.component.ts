import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MenuMode } from '../../../shared/@types/layout';
import { MenuService } from '../menu/app.menu.service';
import { AppBreadcrumbComponent } from "../breadcrumb/app.breadcrumb.component";
import { InputSwitchModule } from 'primeng/inputswitch';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AvatarModule } from 'primeng/avatar';
import { Store } from '@ngrx/store';
import { authFeature } from 'src/app/core/store/auth/auth.reducers';
import { authActions } from 'src/app/core/store/auth/auth.actions';
import { User } from 'src/app/core/models/auth/user';
import { UserProfileService } from 'src/app/core/services/user-profile.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    imports: [
        CommonModule,
        AppBreadcrumbComponent,
        ButtonModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        TooltipModule,
        RippleModule,
        AvatarModule,
    ]
})
export class AppTopbarComponent implements OnInit, OnDestroy {
    @ViewChild('menubutton') menuButton!: ElementRef;

    currentUser$: Observable<User | null>;
    private destroy$ = new Subject<void>();

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService,
        private store: Store,
        public userProfileService: UserProfileService
    ) {
        this.currentUser$ = this.store.select(authFeature.selectUser);
    }

    ngOnInit(): void {
        // Load user profile when component
        this.store.dispatch(authActions.loadUserProfile());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get menuMode(): MenuMode {
        return this.layoutService.config().menuMode;
    }
    set menuMode(_val: MenuMode) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuMode: _val,
        }));
        if (
            this.layoutService.isSlimPlus() ||
            this.layoutService.isSlim() ||
            this.layoutService.isHorizontal()
        ) {
            this.menuService.reset();
        }
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onProfileButtonClick() {
        this.layoutService.showProfileSidebar();
    }
    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }
}
