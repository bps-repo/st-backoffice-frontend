import {Material} from "../../models/academic/material";
import {Unit} from "../../models/academic/unit";

export interface MaterialService {
    createMaterial(
        title: string,
        description: string,
        type: string,
        fileUrl: string,
        uploaderId: string,
        active: boolean,
        availabilityStartDate: Date,
        availabilityEndDate: Date
    ): Promise<Material>;

    findByTitleContaining(title: string): Promise<Material[]>;

    findByType(type: string): Promise<Material[]>;

    findByUploaderId(uploaderId: string): Promise<Material[]>;

    findByActive(active: boolean): Promise<Material[]>;

    findByAvailabilityDate(date: Date): Promise<Material[]>;

    findByUnitId(unitId: string): Promise<Material[]>;

    updateMaterialActiveStatus(
        materialId: string,
        active: boolean
    ): Promise<Material>;

    updateMaterialAvailabilityDates(
        materialId: string,
        availabilityStartDate: Date,
        availabilityEndDate: Date
    ): Promise<Material>;

    updateMaterialFileUrl(materialId: string, fileUrl: string): Promise<Material>;

    getUnitsForMaterial(materialId: string): Promise<Unit[]>;

    addMaterialToUnit(materialId: string, unitId: string): Promise<Material>;

    removeMaterialFromUnit(materialId: string, unitId: string): Promise<Material>;
}
