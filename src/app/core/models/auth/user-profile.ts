import {User} from "./user";

export interface UserProfile {
    id: string;
    user: User;
    birthDate: string;
    firstName: string;
    lastName: string;
    photo: string;
    gender: string;
    identificationNumber: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
}
