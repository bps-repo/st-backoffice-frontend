import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {ICONS} from "./shared/icons/icons";
import {ToastModule} from "primeng/toast";
import {environment} from "../environments/environment";
import {PrimeNG} from "primeng/config";

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, ToastModule],
    template: `
        <p-toast position="top-right"></p-toast>
        <router-outlet></router-outlet>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    private primengConfig = inject(PrimeNG);

    private readonly enableHealthCheck = environment.enableHealthChecks;

    constructor() {
        const iconRegistry = inject(MatIconRegistry)
        const sanitizedSvg = inject(DomSanitizer)


        ICONS.forEach(icon => {
            iconRegistry.addSvgIconLiteral(icon.name, sanitizedSvg.bypassSecurityTrustHtml(icon.svg));
        })
    }

    ngOnInit(): void {
        this.primengConfig.ripple.set(true);
    }
}
