import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {Lesson, mockLesson} from "../../../../../../../../core/models/academic/lesson";
import {ActivatedRoute, Router} from "@angular/router";
import {selectSelectedClass} from "../../../../../../../../core/store/schoolar/selectors/classes.selectors";

@Component({
    selector: 'app-students',
    standalone: true,
    imports: [CommonModule, TableModule, CardModule, ButtonModule, TooltipModule],
    templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit, OnDestroy {
    lessonItem: Lesson | null = mockLesson;
    lessonId: string | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        // Get the lesson ID from the parent route
        this.route.parent?.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.lessonId = params['id'];
            });

        // Subscribe to the selected class/lesson
        this.store.select(selectSelectedClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classItem => {
                if (classItem) {
                    this.lessonItem = classItem;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    BookLesson(studentId?: string): void {
        this.router.navigate(['/schoolar/lessons/books', "dasa", "225453"])
            .then(r => console.log(r));
    }
}
