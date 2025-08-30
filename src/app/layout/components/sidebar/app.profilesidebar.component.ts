import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../service/app.layout.service';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/core/store/auth/actions/auth.actions';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html',
    imports: [
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        TooltipModule,
        RippleModule,
        ButtonModule,
    ]
})
export class AppProfileSidebarComponent {
    constructor(public layoutService: LayoutService, private readonly store: Store) { }

    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }

    logout() {
        this.store.dispatch(authActions.logout());
    }
}
