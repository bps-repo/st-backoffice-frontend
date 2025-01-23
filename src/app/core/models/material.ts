import { MaterialStatus, MaterialType } from '../enums/material';

export interface Material {
    id?: number;
    title: string;
    type: MaterialType;
    description?: string;
    status: MaterialStatus;
    createdDate?: Date;
    updatedDate?: Date;
}
