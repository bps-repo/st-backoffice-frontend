import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Lesson} from "../models/academic/lesson";
import {LessonStatus} from "../enums/lesson-status";
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LessonApiService {
    private apiUrl = `${environment.apiUrl}/lessons`;

    // Mock data for lessons
    private mockLessons: Lesson[] = [
        {
            id: '1',
            title: 'English Conversation Practice',
            description: 'Practice everyday English conversation skills with native speakers',
            teacher: 'John Smith',
            level: 'Intermediate',
            unit: 'Conversation Skills',
            students: [
                {id: '101', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567890'},
                {id: '102', name: 'Bob Williams', email: 'bob@example.com', phone: '+1234567891'},
                {id: '103', name: 'Carol Davis', email: 'carol@example.com', phone: '+1234567892'}
            ],
            online: true,
            onlineLink: 'https://zoom.us/j/123456789',
            startDatetime: new Date('2023-06-15T14:00:00'),
            endDatetime: new Date('2023-06-15T15:30:00'),
            center: 'Downtown Language Center',
            status: LessonStatus.BOOKED,
            attendances: [
                {
                    id: "string",
                    present: true,
                    justification: "string",
                    lesson: {
                        teacher: '',
                        level: '',
                        description: '',
                        students: [],
                        title: '',
                        online: false,
                        startDatetime: new Date(),
                        endDatetime: new Date(),
                        status: LessonStatus.AVAILABLE
                    },
                    student: {
                        name: '',
                        center: '',
                        course: '',
                        level: '',
                        phone: 0,
                        email: '',
                        birthdate: ''
                    },
                    createdAt: '',
                    updatedAt: ''
                },
            ],
            materials: [
                {
                    id: '2001',
                    title: 'Conversation Topics',
                    type: 'pdf',
                    fileUrl: 'https://example.com/materials/topics.pdf',
                    active: true,
                    uploader: {id: '5001', name: 'John Smith'},
                    uploadDate: '2023-06-10',
                    description: '',
                    availabilityStartDate: '',
                    availabilityEndDate: '',
                    units: [],
                    createdAt: '',
                    updatedAt: ''
                }
            ],
            createdAt: new Date('2023-06-01T10:00:00'),
            updatedAt: new Date('2023-06-10T11:30:00')
        },
        {
            id: '2',
            title: 'Business English Workshop',
            description: 'Learn essential vocabulary and phrases for business communication',
            teacher: 'Emily Johnson',
            level: 'Advanced',
            unit: 'Business Communication',
            students: [
                {id: '104', name: 'David Brown', email: 'david@example.com', phone: '+1234567893'},
                {id: '105', name: 'Eva Miller', email: 'eva@example.com', phone: '+1234567894'},
                {id: '106', name: 'Frank Wilson', email: 'frank@example.com', phone: '+1234567895'}
            ],
            online: false,
            startDatetime: new Date('2023-06-16T10:00:00'),
            endDatetime: new Date('2023-06-16T12:00:00'),
            center: 'Business Language Institute',
            status: LessonStatus.SCHEDULED,
            attendances: [],
            materials: [
                {
                    id: '2002',
                    title: 'Business Vocabulary',
                    type: 'pdf',
                    fileUrl: 'https://example.com/materials/business_vocab.pdf',
                    active: true,
                    uploader: {id: '5002', name: 'Emily Johnson'},
                    uploadDate: '2023-06-12',
                    description: '',
                    availabilityStartDate: '',
                    availabilityEndDate: '',
                    units: [],
                    createdAt: '',
                    updatedAt: ''
                },
                {
                    id: '2003',
                    title: 'Email Templates',
                    type: 'docx',
                    fileUrl: 'https://example.com/materials/email_templates.docx',
                    active: true,
                    uploader: {id: '5002', name: 'Emily Johnson'},
                    uploadDate: '2023-06-12',
                    description: '',
                    availabilityStartDate: '',
                    availabilityEndDate: '',
                    units: [],
                    createdAt: '',
                    updatedAt: ''
                }
            ],
            createdAt: new Date('2023-06-02T09:15:00'),
            updatedAt: new Date('2023-06-12T14:20:00')
        },
        {
            id: '3',
            title: 'Spanish for Beginners',
            description: 'Introduction to Spanish language basics',
            teacher: 'Maria Rodriguez',
            level: 'Beginner',
            unit: 'Introduction to Spanish',
            students: [
                {id: '107', name: 'Grace Taylor', email: 'grace@example.com', phone: '+1234567896'},
                {id: '108', name: 'Henry Clark', email: 'henry@example.com', phone: '+1234567897'}
            ],
            online: true,
            onlineLink: 'https://meet.google.com/abc-defg-hij',
            startDatetime: new Date('2023-06-14T16:00:00'),
            endDatetime: new Date('2023-06-14T17:30:00'),
            center: 'Global Language School',
            status: LessonStatus.COMPLETED,
            attendances: [],
            materials: [
                {
                    id: '2004',
                    title: 'Spanish Basics Slides',
                    type: 'pptx',
                    fileUrl: 'https://example.com/materials/spanish_basics.pptx',
                    active: true,
                    uploader: {id: '5003', name: 'Maria Rodriguez'},
                    uploadDate: '2023-06-13',
                    description: '',
                    availabilityStartDate: '',
                    availabilityEndDate: '',
                    units: [],
                    createdAt: '',
                    updatedAt: ''
                }
            ],
            createdAt: new Date('2023-06-01T11:30:00'),
            updatedAt: new Date('2023-06-14T18:00:00')
        },
        {
            id: '4',
            title: 'French Pronunciation Workshop',
            description: 'Focus on improving French pronunciation and accent',
            teacher: 'Pierre Dupont',
            level: 'Intermediate',
            unit: 'Pronunciation',
            students: [
                {id: '109', name: 'Isabel Martinez', email: 'isabel@example.com', phone: '+1234567898'},
                {id: '110', name: 'Jack Thompson', email: 'jack@example.com', phone: '+1234567899'},
                {id: '111', name: 'Karen White', email: 'karen@example.com', phone: '+1234567900'}
            ],
            online: false,
            startDatetime: new Date('2023-06-17T13:00:00'),
            endDatetime: new Date('2023-06-17T15:00:00'),
            center: 'French Cultural Institute',
            status: LessonStatus.BOOKED,
            attendances: [],
            materials: [
                {
                    id: '2005',
                    title: 'Pronunciation Guide',
                    type: 'pdf',
                    fileUrl: 'https://example.com/materials/french_pronunciation.pdf',
                    active: true,
                    uploader: {id: '5004', name: 'Pierre Dupont'},
                    uploadDate: '2023-06-15',
                    description: '',
                    availabilityStartDate: '',
                    availabilityEndDate: '',
                    units: [],
                    createdAt: '',
                    updatedAt: ''
                },
                {
                    id: '2006',
                    title: 'Audio Exercises',
                    type: 'mp3',
                    fileUrl: 'https://example.com/materials/pronunciation_exercises.mp3',
                    active: true,
                    uploader: {id: '5004', name: 'Pierre Dupont'},
                    uploadDate: '2023-06-15',
                    description: '',
                    availabilityStartDate: '',
                    availabilityEndDate: '',
                    units: [],
                    createdAt: '',
                    updatedAt: ''
                }
            ],
            createdAt: new Date('2023-06-05T10:45:00'),
            updatedAt: new Date('2023-06-15T09:30:00')
        },
        {
            id: '5',
            title: 'German Grammar Review',
            description: 'Comprehensive review of intermediate German grammar',
            teacher: 'Hans Mueller',
            level: 'Intermediate',
            unit: 'Grammar',
            students: [
                {id: '112', name: 'Leo Adams', email: 'leo@example.com', phone: '+1234567901'},
                {id: '113', name: 'Mia Garcia', email: 'mia@example.com', phone: '+1234567902'}
            ],
            online: true,
            onlineLink: 'https://zoom.us/j/987654321',
            startDatetime: new Date('2023-06-13T11:00:00'),
            endDatetime: new Date('2023-06-13T12:30:00'),
            center: 'European Language Center',
            status: LessonStatus.CANCELLED,
            attendances: [],
            materials: [
                {
                    id: '2007',
                    title: 'Grammar Exercises',
                    type: 'pdf',
                    fileUrl: 'https://example.com/materials/german_grammar.pdf',
                    active: true,
                    uploader: {id: '5005', name: 'Hans Mueller'},
                    uploadDate: '2023-06-10',
                    description: '',
                    availabilityStartDate: '',
                    availabilityEndDate: '',
                    units: [],
                    createdAt: '',
                    updatedAt: ''
                }
            ],
            createdAt: new Date('2023-06-03T14:20:00'),
            updatedAt: new Date('2023-06-12T10:15:00')
        }
    ];

    constructor(private http: HttpClient) {
    }

    getLessons(): Observable<Lesson[]> {
        // Return mock data instead of making HTTP request
        return of(this.mockLessons);
    }

    getLesson(id: string): Observable<Lesson> {
        // Find the lesson with the given ID in the mock data
        const lesson = this.mockLessons.find(l => l.id === id);

        // If lesson is found, return it, otherwise return a default lesson
        if (lesson) {
            return of(lesson);
        } else {
            console.error(`Lesson with ID ${id} not found`);
            return of(this.mockLessons[0]); // Return the first lesson as a fallback
        }
    }

    createLesson(lessonData: Lesson): Observable<Lesson> {
        // Generate a new ID for the lesson
        const newId = (Math.max(...this.mockLessons.map(l => parseInt(l.id!))) + 1).toString();

        // Create a new lesson with the given data and the new ID
        const newLesson: Lesson = {
            ...lessonData,
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Add the new lesson to the mock data
        this.mockLessons.push(newLesson);

        // Return the new lesson
        return of(newLesson);
    }

    updateLesson(lessonData: Lesson): Observable<Lesson> {
        // Find the index of the lesson with the given ID
        const index = this.mockLessons.findIndex(l => l.id === lessonData.id);

        // If the lesson is found, update it
        if (index !== -1) {
            // Create an updated lesson with the given data and the current date as updatedAt
            const updatedLesson: Lesson = {
                ...lessonData,
                updatedAt: new Date()
            };

            // Replace the old lesson with the updated one
            this.mockLessons[index] = updatedLesson;

            // Return the updated lesson
            return of(updatedLesson);
        } else {
            console.error(`Lesson with ID ${lessonData.id} not found`);
            return of(lessonData); // Return the input data as a fallback
        }
    }

    deleteLesson(id: string): Observable<void> {
        // Find the index of the lesson with the given ID
        const index = this.mockLessons.findIndex(l => l.id === id);

        // If the lesson is found, remove it
        if (index !== -1) {
            this.mockLessons.splice(index, 1);
        } else {
            console.error(`Lesson with ID ${id} not found`);
        }

        // Return void
        return of(undefined);
    }
}
