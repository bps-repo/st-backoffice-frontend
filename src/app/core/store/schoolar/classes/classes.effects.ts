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

    loadClass = createEffect(() =>
        this.actions$.pipe(
            ofType(classesActions.loadClass),
            exhaustMap(({id}) =>
                this.classService.getClassById(id).pipe(
                    map((classData) => classesActions.loadClassSuccess({classData})),
                    catchError((error) =>
                        of(classesActions.loadClassFailure({error: error.message}))
                    )
                )
            )
        )
    );

    createClass = createEffect(() =>
        this.actions$.pipe(
            ofType(classesActions.createClass),
            exhaustMap(({classData}) =>
                this.classService.createClass(classData).pipe(
                    map((createdClass) => classesActions.createClassSuccess({classData: createdClass})),
                    catchError((error) =>
                        of(classesActions.createClassFailure({error: error.message}))
                    )
                )
            )
        )
    );
}
