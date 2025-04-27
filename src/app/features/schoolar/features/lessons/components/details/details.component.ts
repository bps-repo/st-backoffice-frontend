import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Class } from 'src/app/core/models/academic/class';
import { lessonsActions } from 'src/app/core/store/schoolar';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
    selectLoadingClass,
    selectSelectedClass
} from "../../../../../../core/store/schoolar/selectors/classes.selectors";

@Component({
    selector: 'app-details',
    imports: [CommonModule, CardModule, TabViewModule, ButtonModule, ProgressSpinnerModule],
    templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit, OnDestroy {
    classItem: Class | null = null;
    loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit(): void {
        // Get the class ID from the route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    // Dispatch action to load the class
                    this.store.dispatch(lessonsActions.loadClass({ id }));
                }
            });

        // Subscribe to the selected class
        this.store.select(selectSelectedClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classItem => {
                this.classItem = classItem!;
            });

        // Subscribe to loading state
        this.store.select(selectLoadingClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.loading = loading;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
