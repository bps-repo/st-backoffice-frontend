import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClassesService {
    // Signals to manage dialog states
    private createClassDialogState = new BehaviorSubject<boolean>(false);
    private deleteClassDialogState = new BehaviorSubject<boolean>(false);

    // Observables for components to subscribe to
    createClassDialog$ = this.createClassDialogState.asObservable();
    deleteClassDialog$ = this.deleteClassDialogState.asObservable();

    // Methods to update dialog states
    setCreateClassDialogState(state: boolean) {
        this.createClassDialogState.next(state);
    }

    setDeleteClassDialogState(state: boolean) {
        this.deleteClassDialogState.next(state);
    }
}
