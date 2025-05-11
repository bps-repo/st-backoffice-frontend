import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as LevelActions from 'src/app/core/store/course/actions/level.actions';
import { selectSelectedLevel, selectLevelLoading } from 'src/app/core/store/course/selectors/level.selector';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { Level } from 'src/app/core/models/course/level';

@Component({
    selector: 'app-level-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule, SkeletonModule, InputTextModule, InputTextareaModule, ButtonModule]
})
export class DetailComponent implements OnInit {
    levelId: string = '';
    level$: Observable<Level | null>;
    level: Level | null = null;
    loading$: Observable<boolean>;
    loading: boolean = true;

    constructor(private route: ActivatedRoute, private store: Store) {
        this.level$ = this.store.select(selectSelectedLevel);
        this.loading$ = this.store.select(selectLevelLoading);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.levelId = params['id'];
            this.loadLevel();
        });

        // Subscribe to level and loading observables
        this.level$.subscribe(level => {
            this.level = level;
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });
    }

    loadLevel(): void {
        // Dispatch action to load the selected level
        this.store.dispatch(LevelActions.loadLevel({ id: this.levelId }));
    }

    downloadLevelDetails(): void {
        // Simulação de download dos detalhes do nível
        console.log('Downloading level details:', this.level);
        alert('Download dos detalhes do Nível iniciado');
    }

    sendLevelDetails(): void {
        // Simulação de envio dos detalhes do nível
        console.log('Sending level details:', this.level?.name);
        alert('Detalhes do Nível enviados para ' + this.level?.name);
    }
}
