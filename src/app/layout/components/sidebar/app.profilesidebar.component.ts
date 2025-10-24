import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { LayoutService } from '../../service/app.layout.service';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/core/store/auth/auth.actions';
import { authFeature } from 'src/app/core/store/auth/auth.reducers';
import { User } from 'src/app/core/models/auth/user';
import { UserProfileService } from 'src/app/core/services/user-profile.service';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html',
    imports: [
        CommonModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        TooltipModule,
        RippleModule,
        ButtonModule,
        AvatarModule,
    ]
})
export class AppProfileSidebarComponent implements OnInit, OnDestroy {
    currentUser$: Observable<User | null>;
    private destroy$ = new Subject<void>();

    constructor(
        public layoutService: LayoutService,
        private readonly store: Store,
        private router: Router,
        public userProfileService: UserProfileService
    ) {
        this.currentUser$ = this.store.select(authFeature.selectUser);
    }

    ngOnInit(): void {
        this.store.dispatch(authActions.loadUserProfile());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }

    logout() {
        this.store.dispatch(authActions.logout());
    }

    navigateToProfile() {
        this.router.navigate(['/settings/profile']);
        this.visible = false;
    }

    navigateToSettings() {
        this.router.navigate(['/settings']);
        this.visible = false;
    }

    getStatusSeverity(status: string): "success" | "warning" | "info" | "danger"  | null {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'warning';
            case 'SUSPENDED':
                return 'danger';
            case 'PENDING':
                return 'info';
            default:
                return 'info';
        }
    }
}
