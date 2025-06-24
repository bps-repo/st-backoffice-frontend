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
    ) {}

    ngOnInit(): void {
        this.route.parent?.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.lessonId = params['id'];
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
