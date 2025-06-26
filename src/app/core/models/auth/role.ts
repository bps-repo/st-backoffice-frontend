import {Permission} from "./permission";

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
}
