import {Lesson} from "./lesson";

export interface LessonEvent extends Partial<Lesson> {
    allDay?: boolean;
    tag?: { color: string; name: string; };
    color?: string;
    borderColor?: string;
    textColor?: string;
    startHour?: string;
    endHour?: string;
    date: string;
    class: string;
    time: string;
    teacher: string;
    level: string;
    description: string;
    center: string;
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    extendedProps?: {
        teacher?: string;
        center?: string;
        classEntity?: string;
        description?: string;
        isOnline?: boolean;
        status?: string;
        time?: string;
    }
}
