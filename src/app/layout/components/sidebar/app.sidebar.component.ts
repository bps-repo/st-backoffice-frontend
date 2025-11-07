import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';
import { AppMenuComponent } from "../menu/app.menu.component";
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    styleUrls: ['./app.sidebar.component.css'],
    imports: [
        CommonModule,
        RouterModule,
        AppMenuComponent,
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
export class AppSidebarComponent {
    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(
        public layoutService: LayoutService,
        public el: ElementRef
    ) {}

    get isDrawerOrReveal(): boolean {
        const menuMode = this.layoutService.config().menuMode;
        return menuMode === 'drawer' || menuMode === 'reveal';
    }

    onMouseEnter() {
        if (!this.layoutService.state.anchored && this.isDrawerOrReveal) {
            // Open sidebar
            this.layoutService.state.sidebarActive = true;
        }
    }

    onMouseLeave(event: MouseEvent) {
        if (!this.layoutService.state.anchored && this.isDrawerOrReveal) {
            // Close sidebar immediately when mouse leaves
            this.layoutService.state.sidebarActive = false;
        }
    }

    onMenuMouseLeave(event: MouseEvent) {
        // Don't do anything - let the main sidebar mouseleave handle it
    }

    anchor() {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
    }

}
