import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';
import {selectSelectedClass} from 'src/app/core/store/schoolar/selectors/classes.selectors';
import {Lesson} from "../../../../../../../../core/models/academic/lesson";
import {LessonStatus} from "../../../../../../../../core/enums/lesson-status";

@Component({
    selector: 'app-general',
    standalone: true,
    imports: [CommonModule, CardModule, TagModule],
    templateUrl: './general.component.html'
})
export class GeneralComponent implements OnInit, OnDestroy {
    lessonItem: Lesson | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {
    }

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

    /**
     * Calculate duration between start and end date/time in minutes
     */
    getDuration(startDate: Date, endDate: Date): number {
        if (!startDate || !endDate) {
            return 0;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate difference in milliseconds
        const diffMs = end.getTime() - start.getTime();

        // Convert to minutes
        return Math.round(diffMs / 60000);
    }

    protected LessonStatus = LessonStatus
}
