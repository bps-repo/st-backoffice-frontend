import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ClassesService {
    // Signals to manage dialog states
    createClassDialog = signal(false);
    deleteClassDialog = signal(false);

    // Methods to update dialog states
    openCreateClassDialog() {
        this.createClassDialog.set(true);
    }

    closeCreateClassDialog() {
        this.createClassDialog.set(false);
    }

    openDeleteClassDialog() {
        this.deleteClassDialog.set(true);
    }

    closeDeleteClassDialog() {
        this.deleteClassDialog.set(false);
    }
}
