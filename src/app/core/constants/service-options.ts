import { ServiceAudienceType } from '../enums/service-audience-type';
import { ServiceCategory } from '../enums/service-category';
import { ServicePayload } from '../models/course/service';

export const SERVICE_CATEGORY_OPTIONS: { label: string; value: ServiceCategory }[] = [
    { label: 'Curso de idiomas', value: ServiceCategory.LANGUAGE_COURSE },
    { label: 'Geral', value: ServiceCategory.GENERAL },
    { label: 'Serviço', value: ServiceCategory.SERVICE },
    { label: 'Material', value: ServiceCategory.MATERIAL },
];

export const SERVICE_AUDIENCE_TYPE_OPTIONS: { label: string; value: ServiceAudienceType }[] = [
    { label: 'Adultos', value: ServiceAudienceType.ADULTS },
    { label: 'Corporativo', value: ServiceAudienceType.CORPORATE },
    { label: 'Kids', value: ServiceAudienceType.KIDS },
];

export function getServiceCategoryLabel(category: string | undefined): string {
    return SERVICE_CATEGORY_OPTIONS.find((o) => o.value === category)?.label ?? category ?? '-';
}

export function getServiceAudienceTypeLabel(type: string | undefined): string {
    return SERVICE_AUDIENCE_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type ?? '-';
}

/** Normaliza o formulário para o body esperado por POST/PATCH /products */
export function toServiceRequestPayload(form: ServicePayload): ServicePayload {
    return {
        name: form.name.trim(),
        description: form.description?.trim() ?? '',
        value: form.value ?? 0,
        active: form.active,
        category: form.category,
        type: form.type,
        code: form.code?.trim() ?? '',
        providerName: form.providerName?.trim() ?? '',
        hasStock: form.hasStock,
        minimumStock: form.hasStock ? (form.minimumStock ?? 0) : 0,
        currentStock: form.hasStock ? (form.currentStock ?? 0) : 0,
    };
}
