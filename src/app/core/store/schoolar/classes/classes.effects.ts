import {Injectable} from '@angular/core';
import {Actions, ofType, createEffect} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {ClassService} from "../../../services/class.service";
import {classesActions} from "./classes.actions";

@Injectable()
export class ClassEffects {
    constructor(private actions$: Actions, private classService: ClassService) {
    }

    loadClasses = createEffect(() =>
        this.actions$.pipe(
            ofType(classesActions.loadClasses),
            exhaustMap(() =>
                this.classService.getClasses().pipe(
                    map((classes) => classesActions.loadClassesSuccess({classes})),
                    catchError((error) =>
                        of(classesActions.loadClassesFailure({error: error.message}))
                    )
                )
            )
        )
    );
}
