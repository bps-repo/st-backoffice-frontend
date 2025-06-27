import {Injectable} from '@angular/core';
import {Actions, ofType, createEffect} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {ClassService} from "../../../services/class.service";
import {ClassesActions} from "./classesActions";
import {HttpErrorResponse} from "@angular/common/module.d-CnjH8Dlt";

@Injectable()
export class ClassEffects {
    constructor(private actions$: Actions, private classService: ClassService) {
    }

    loadClasses = createEffect(() =>
        this.actions$.pipe(
            ofType(ClassesActions.loadClasses),
            exhaustMap(() =>
                this.classService.getClasses().pipe(
                    map((classes) => ClassesActions.loadClassesSuccess({classes})),
                    catchError((error: HttpErrorResponse) =>
                        of(ClassesActions.loadClassesFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    loadClass = createEffect(() =>
        this.actions$.pipe(
            ofType(ClassesActions.loadClass),
            exhaustMap(({id}) =>
                this.classService.getClassById(id).pipe(
                    map((classData) => ClassesActions.loadClassSuccess({classData})),
                    catchError((error: HttpErrorResponse) =>
                        of(ClassesActions.loadClassFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    createClass = createEffect(() =>
        this.actions$.pipe(
            ofType(ClassesActions.createClass),
            exhaustMap(({classData}) =>
                this.classService.createClass(classData).pipe(
                    map((createdClass) => ClassesActions.createClassSuccess({classData: createdClass})),
                    catchError((error: HttpErrorResponse) =>
                        of(ClassesActions.createClassFailure({error: error.error.message}))
                    )
                )
            )
        )
    );
}
