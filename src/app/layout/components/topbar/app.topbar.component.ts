import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
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
import { authActions } from 'src/app/core/store/auth/auth.actions';
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
export class AppTopbarComponent implements OnInit {
    layoutService = inject(LayoutService);
    private store = inject(Store);
    userProfileService = inject(UserProfileService);

    @ViewChild('menubutton') menuButton!: ElementRef;

    ngOnInit(): void {
        this.store.dispatch(authActions.loadUserProfile());
    }

    get isSidebarExpanded(): boolean {
        return this.layoutService.config().menuMode === 'static';
    }

    onMenuButtonClick(): void {
        const next = this.isSidebarExpanded ? 'drawer' : 'static';
        this.layoutService.config.update(config => ({ ...config, menuMode: next }));
    }

    onProfileButtonClick() {
        this.layoutService.showProfileSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }
}
