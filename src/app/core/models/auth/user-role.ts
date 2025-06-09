import { User } from './user';
import { Role } from './role';

export interface UserRole {
    id: number;
    user: User;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
