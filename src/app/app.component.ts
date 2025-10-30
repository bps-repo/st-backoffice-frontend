import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {PrimeNGConfig} from 'primeng/api'
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {ICONS} from "./shared/icons/icons";
import {ToastModule} from "primeng/toast";
import {HealthCheckService} from "./core/services/health-check.service";
import {environment} from "../environments/environment";

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, ToastModule],
    template: `
        <p-toast position="top-right"></p-toast>
        <router-outlet></router-outlet>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    private readonly enableHealthCheck = environment.enableHealthChecks;
    ICONS: { name: string, svg: string }[] = ICONS

    constructor(private primengConfig: PrimeNGConfig, private readonly healthService: HealthCheckService) {
        const iconRegistry = inject(MatIconRegistry)
        const sanitizedSvg = inject(DomSanitizer)


        ICONS.forEach(icon => {
            iconRegistry.addSvgIconLiteral(icon.name, sanitizedSvg.bypassSecurityTrustHtml(icon.svg));
        })

        setInterval(() => {
            if (this.enableHealthCheck) this.healthService.getHealth().subscribe((v) => console.log(v))
            console.log("Health check ok")
        }, 8000)
    }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
    }
}
