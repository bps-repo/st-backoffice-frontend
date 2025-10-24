import { InjectionToken, Type } from '@angular/core';

export interface Tab {
  header: string;
  icon?: string;
  title?: string;
  description?: string;
  template: Type<any>;
  style?: string;
  data?: {
    token: InjectionToken<any>;
    value?: any;
  };
}