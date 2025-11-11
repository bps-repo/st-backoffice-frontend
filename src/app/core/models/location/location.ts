export interface Municipality {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    provinceId: string;
    provinceName: string;
}

export interface Province {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    municipalities: Municipality[] | null;
}

