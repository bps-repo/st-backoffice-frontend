import {InjectionToken, Type} from "@angular/core";

export interface Tab<T = any> {
    header: string;
    icon: string;
    title: string;
    description?: string;
    template: Type<any>;
    style?: any;
    data: { token: InjectionToken<string>, value?: T }
}
