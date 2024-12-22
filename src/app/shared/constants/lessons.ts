import { Lesson } from 'src/app/core/models/lesson';

export const LESSONS: Lesson[] = [
    {
        date: '2022-12-25',
        class: 'English for Business',
        time: '10:00 AM - 12:00 PM',
        teacher: 'Dr. Mary Jane Smith',
        level: 'Beginner',
        description: 'Learn the basics of English for business',
        presence: true,
    },
    {
        date: '2022-12-26',
        class: 'Math for Business',
        time: '10:00 AM - 12:00 PM',
        teacher: 'Mr. John Doe',
        level: 'Intermediate',
        description: 'Learn the basics of math for business',
        presence: false,
    },
];
