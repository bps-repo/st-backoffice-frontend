import { Injectable, inject, signal, computed } from '@angular/core';
import { LessonService } from './lesson.service';
import { Lesson, LessonCreate, LessonUpdate } from 'src/app/core/models/academic/lesson';
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

    async patchLesson(id: string, payload: LessonUpdate): Promise<Lesson | null> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const updated = await firstValueFrom(
                this.lessonService.patchLesson(id, payload)
            );
            this.lessons.update(list =>
                list.map(l => l.id === id ? { ...l, ...updated } : l)
            );
            return updated;
        } catch (err: any) {
            const message = err?.error?.message || err?.message || 'Erro ao atualizar aula';
            this.error.set(message);
            return null;
        } finally {
            this.loading.set(false);
        }
    }

    async loadLessons(filters: Parameters<LessonService['searchLessons']>[0] = {}) {
        this.loading.set(true);
        this.error.set(null);
        try {
            const page = await firstValueFrom(
                this.lessonService.searchLessons(filters)
            );
            this.lessons.set(page.content ?? []);
        } catch (err: any) {
            const message = err?.error?.message || err?.message || 'Erro desconhecido';
            this.error.set(message);
        } finally {
            this.loading.set(false);
        }
    }
}
