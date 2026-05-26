export interface StudentCertificate {
    id: string;
    student: {
        id: string;
        [key: string]: any;
    };
    levelId: string;
    levelName: string;
    issueDate: string; // ISO date-time
    certificateNumber: string;
    publishedToStudent: boolean;
}
