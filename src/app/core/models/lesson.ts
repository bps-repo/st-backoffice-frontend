export interface Lesson {
    id?: string;
    date: string;
    class: string;
    time: string;
    teacher: string;
    center: string;
    level: string;
    description: string;
    students: string;
}

export interface LessonEvent extends Lesson {
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    tag: { color: string; name: string };
    startHour: string;
    endHour: string;
}
