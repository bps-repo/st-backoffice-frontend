export interface LessonCenter {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    email: string;
    address: string | null;
    city: string | null;
    phone: string;
    active: boolean;
}
