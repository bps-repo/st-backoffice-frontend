import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    signal,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommandPaletteService, PaletteCommand } from '../../services/command-palette.service';

interface CommandGroup {
    label: string;
    commands: PaletteCommand[];
}

@Component({
    selector: 'app-command-palette',
    imports: [CommonModule, DialogModule, InputTextModule],
    templateUrl: './command-palette.component.html',
    styleUrl: './command-palette.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
    private router = inject(Router);
    readonly paletteService = inject(CommandPaletteService);

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

    query = signal('');
    activeIndex = signal(0);

    filteredGroups = computed<CommandGroup[]>(() => {
        const q = this.query().toLowerCase().trim();
        const allCommands = this.paletteService.commands;

        const matches = q
            ? allCommands.filter(cmd =>
                cmd.label.toLowerCase().includes(q) ||
                cmd.description.toLowerCase().includes(q) ||
                cmd.keywords.some(k => k.includes(q))
            )
            : allCommands;

        const grouped = new Map<string, PaletteCommand[]>();
        for (const cmd of matches) {
            if (!grouped.has(cmd.group)) grouped.set(cmd.group, []);
            grouped.get(cmd.group)!.push(cmd);
        }

        return Array.from(grouped.entries()).map(([label, commands]) => ({ label, commands }));
    });

    flatFiltered = computed<PaletteCommand[]>(() =>
        this.filteredGroups().flatMap(g => g.commands)
    );

    constructor() {
        effect(() => {
            if (this.paletteService.isOpen()) {
                this.query.set('');
                this.activeIndex.set(0);
                setTimeout(() => this.searchInput?.nativeElement.focus(), 80);
            }
        });
    }

    onKeydown(event: KeyboardEvent): void {
        const flat = this.flatFiltered();
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.activeIndex.update(i => Math.min(i + 1, flat.length - 1));
                this.scrollActiveIntoView();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.activeIndex.update(i => Math.max(i - 1, 0));
                this.scrollActiveIntoView();
                break;
            case 'Enter':
                event.preventDefault();
                this.execute(flat[this.activeIndex()]);
                break;
            case 'Escape':
                this.paletteService.close();
                break;
        }
    }

    execute(cmd: PaletteCommand | undefined): void {
        if (!cmd) return;
        this.paletteService.close();
        this.router.navigate(cmd.routerLink);
    }

    isActive(cmd: PaletteCommand): boolean {
        return this.flatFiltered()[this.activeIndex()]?.id === cmd.id;
    }

    onItemHover(cmd: PaletteCommand): void {
        const idx = this.flatFiltered().findIndex(c => c.id === cmd.id);
        if (idx !== -1) this.activeIndex.set(idx);
    }

    onHide(): void {
        this.paletteService.close();
    }

    private scrollActiveIntoView(): void {
        setTimeout(() => {
            const el = document.querySelector('.cp-item--active');
            el?.scrollIntoView({ block: 'nearest' });
        });
    }
}
