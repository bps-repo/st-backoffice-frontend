import { Injectable, inject, signal, computed } from '@angular/core';
import { LessonService } from './lesson.service';
import { Lesson, LessonCreate } from 'src/app/core/models/academic/lesson';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LessonsFacade {

    private lessonService = inject(LessonService);

    // state
    lessons = signal<Lesson[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    // derived state example
    availableLessons = computed(() =>
        this.lessons().filter(l => l.status === 'AVAILABLE')
    );

    async createLesson(payload: LessonCreate) {
        this.loading.set(true);
        this.error.set(null);
        try {
            const created = await firstValueFrom(
                this.lessonService.createLesson(payload)
            );

            // update local cache if needed
            this.lessons.update(list => [created, ...list]);
        } catch (err: any) {
            const message = err?.error?.message || err?.message || 'Erro desconhecido';
            this.error.set(message);
        } finally {
            this.loading.set(false);
        }
    }

    async loadLessons() {
        this.loading.set(true);
        this.error.set(null);
        try {
            const data = await firstValueFrom(
                this.lessonService.getLessons()
            );

            this.lessons.set(data);
        } catch (err: any) {
            const message = err?.error?.message || err?.message || 'Erro desconhecido';
            this.error.set(message);
        } finally {
            this.loading.set(false);
        }
    }
}
