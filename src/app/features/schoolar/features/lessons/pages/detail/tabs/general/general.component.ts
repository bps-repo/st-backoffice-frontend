import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';
import { selectSelectedClass } from 'src/app/core/store/schoolar/selectors/classes.selectors';
import {Lesson} from "../../../../../../../../core/models/academic/lesson";

@Component({
    selector: 'app-general',
    standalone: true,
    imports: [CommonModule, CardModule],
    templateUrl: './general.component.html'
})
export class GeneralComponent implements OnInit {
    lessonItem: Lesson | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit(): void {
        // Subscribe to the selected class
        this.store.select(selectSelectedClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classItem => {
                this.lessonItem = classItem!;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
