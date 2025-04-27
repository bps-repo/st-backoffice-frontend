import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Class } from 'src/app/core/models/academic/class';
import { selectSelectedClass } from 'src/app/core/store/schoolar/selectors/classes.selectors';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {Lesson} from "../../../../../../../../core/models/academic/lesson";

@Component({
    selector: 'app-students',
    standalone: true,
    imports: [CommonModule, TableModule, CardModule, ButtonModule],
    templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit {
    lessonItem: Lesson | null = null;
    private destroy$ = new Subject<void>();

    constructor(private store: Store) {}

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
