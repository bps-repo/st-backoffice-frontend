import { Component, ElementRef, ViewChild, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
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
export class AppSidebarComponent implements OnDestroy, AfterViewInit {
    timeout: any = null;
    documentMouseLeaveListener: (() => void) | null = null;
    lastMousePosition: { x: number; y: number } | null = null;

    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(
        public layoutService: LayoutService, 
        public el: ElementRef,
        private renderer: Renderer2
    ) {}

    ngAfterViewInit() {
        // Use mousemove as a backup to detect when mouse leaves sidebar area
        // This helps catch cases where mouseleave might not fire properly
        this.documentMouseLeaveListener = this.renderer.listen('document', 'mousemove', (event: MouseEvent) => {
            // Store last mouse position for verification
            this.lastMousePosition = { x: event.clientX, y: event.clientY };
            
            if (!this.layoutService.state.anchored && this.isDrawerOrReveal && this.layoutService.state.sidebarActive) {
                const sidebarElement = this.el.nativeElement;
                const rect = sidebarElement.getBoundingClientRect();
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                
                // Check if mouse coordinates are outside the sidebar bounds
                const isOutside = mouseX < rect.left || mouseX > rect.right || 
                                 mouseY < rect.top || mouseY > rect.bottom;
                
                if (isOutside) {
                    // Only schedule collapse if not already scheduled
                    if (!this.timeout) {
                        this.scheduleCollapse();
                    }
                } else {
                    // Mouse is inside sidebar, cancel any pending collapse
                    if (this.timeout) {
                        clearTimeout(this.timeout);
                        this.timeout = null;
                    }
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (this.documentMouseLeaveListener) {
            this.documentMouseLeaveListener();
            this.documentMouseLeaveListener = null;
        }
    }

    get isDrawerOrReveal(): boolean {
        const menuMode = this.layoutService.config().menuMode;
        return menuMode === 'drawer' || menuMode === 'reveal';
    }

    private scheduleCollapse() {
        // Clear any existing timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        // Schedule collapse after a short delay to allow for mouse movement
        this.timeout = setTimeout(() => {
            // Verify conditions are still met before collapsing
            if (!this.layoutService.state.anchored && this.isDrawerOrReveal && this.layoutService.state.sidebarActive) {
                // Double-check that mouse is still outside before collapsing
                if (this.lastMousePosition) {
                    const sidebarElement = this.el.nativeElement;
                    const rect = sidebarElement.getBoundingClientRect();
                    
                    // Check if last known mouse coordinates are outside the sidebar bounds
                    const isOutside = this.lastMousePosition.x < rect.left || 
                                     this.lastMousePosition.x > rect.right || 
                                     this.lastMousePosition.y < rect.top || 
                                     this.lastMousePosition.y > rect.bottom;
                    
                    if (isOutside) {
                        this.layoutService.state.sidebarActive = false;
                    }
                } else {
                    // If we don't have mouse position, collapse anyway (fallback)
                    this.layoutService.state.sidebarActive = false;
                }
            }
            this.timeout = null;
        }, 200);
    }

    onMouseEnter() {
        if (!this.layoutService.state.anchored && this.isDrawerOrReveal) {
            // Cancel any pending collapse
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            // Expand sidebar
            this.layoutService.state.sidebarActive = true;
        }
    }

    onMouseLeave(event: MouseEvent) {
        if (!this.layoutService.state.anchored && this.isDrawerOrReveal) {
            const sidebarElement = this.el.nativeElement;
            const relatedTarget = event.relatedTarget as Node;
            
            // Check if mouse is actually leaving the sidebar (not just moving to a child element)
            if (!relatedTarget || !sidebarElement.contains(relatedTarget)) {
                this.scheduleCollapse();
            }
        }
    }

    onMenuMouseLeave(event: MouseEvent) {
        // Handle mouse leave on menu container - same as sidebar leave
        this.onMouseLeave(event);
    }

    anchor() {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
        // Clear timeout when anchoring/unanchoring
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

}
