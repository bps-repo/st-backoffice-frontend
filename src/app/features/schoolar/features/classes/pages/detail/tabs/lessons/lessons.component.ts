import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Class } from 'src/app/core/models/academic/class';
import { selectSelectedClass } from 'src/app/core/store/schoolar/selectors/classes.selectors';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-lessons',
    standalone: true,
    imports: [CommonModule, TableModule, CardModule, ButtonModule, CalendarModule],
    templateUrl: './lessons.component.html'
})
export class LessonsComponent implements OnInit {
    classItem: Class | null = null;
    private destroy$ = new Subject<void>();

    constructor(private store: Store) {}

    ngOnInit(): void {
        // Subscribe to the selected class
        this.store.select(selectSelectedClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classItem => {
                this.classItem = classItem!;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
