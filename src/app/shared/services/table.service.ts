import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TableService<T extends Object> {
    protected filterTypeMap = new Map<
        string,
        string | ((value: any) => string)
    >([
        ['number', 'numeric'],
        ['string', 'text'],
        ['boolean', 'boolean'],
        ['object', (value) => (value instanceof Date ? 'date' : 'text')],
    ]);

    getFilterType(fieldValue: any): string {
        const type = typeof fieldValue;
        const filterType = this.filterTypeMap.get(type);

        if (typeof filterType === 'function') {
            return filterType(fieldValue); // Handle special cases like Date
        }

        return filterType || 'text'; // Default to 'text' if type is not mapped
    }
    populateColumnsFromModel(
        model: T,
        columns: any[],
        globalFilterFields: any[]
    ) {
        Object.keys(model).forEach((fieldName) => {
            // Determine filter type based on the field's value type
            let filterType: string;
            const fieldValue: any = model[fieldName as keyof T];

            filterType = this.getFilterType(fieldValue);

            // Add the field to columns
            columns.push({
                field: fieldName,
                header: this.capitalizeHeader(fieldName),
                filterType,
            });

            // Add the field to globalFilterFields
            globalFilterFields.push(fieldName);
        });
    }

    capitalizeHeader(field: string): string {
        return field
            .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
            .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
    }
}
