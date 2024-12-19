import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { AppConfigModule } from '../../config/app.config.module';
import { AppSidebarComponent } from '../sidebar/app.sidebar.component';
import { AppTopbarComponent } from '../topbar/app.topbar.component';
import { AppProfileSidebarComponent } from '../sidebar/app.profilesidebar.component';
import { AppMenuComponent } from '../menu/app.menu.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppBreadcrumbComponent } from '../breadcrumb/app.breadcrumb.component';
import { AppMenuitemComponent } from '../menu/app.menuitem.component';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from './app.layout.component';

@NgModule({
    declarations: [
        AppBreadcrumbComponent,
        AppSidebarComponent,
        AppTopbarComponent,
        AppProfileSidebarComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppLayoutComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        //HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        ButtonModule,
        TooltipModule,
        RippleModule,
        RouterModule,
        AppConfigModule,
        CommonModule,
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppLayoutModule {}
