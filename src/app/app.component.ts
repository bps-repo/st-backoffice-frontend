import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {PrimeNGConfig} from 'primeng/api'
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {ICONS} from "./shared/icons/icons";

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet],
    template: `
        <router-outlet></router-outlet>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    ICONS: { name: string, svg: string }[] = ICONS

    constructor(private primengConfig: PrimeNGConfig) {
        const iconRegistry = inject(MatIconRegistry)
        const sanitizedSvg = inject(DomSanitizer)


        ICONS.forEach(icon => {
            iconRegistry.addSvgIconLiteral(icon.name, sanitizedSvg.bypassSecurityTrustHtml(icon.svg));
        })
    }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
    }
}
